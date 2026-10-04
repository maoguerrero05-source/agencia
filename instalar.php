<?php

declare(strict_types=1);

$config = require __DIR__ . '/api/config.php';

header('Content-Type: text/html; charset=utf-8');

function run_sql(PDO $pdo, string $sql): void
{
    $pdo->exec($sql);
}

try {
    $root = new PDO(
        sprintf('mysql:host=%s;charset=%s', $config['db_host'], $config['db_charset']),
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $root->exec('CREATE DATABASE IF NOT EXISTS `agencia` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');

    $pdo = new PDO(
        sprintf('mysql:host=%s;dbname=%s;charset=%s', $config['db_host'], $config['db_name'], $config['db_charset']),
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    run_sql($pdo, 'CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      telefono VARCHAR(40) DEFAULT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');

    run_sql($pdo, 'CREATE TABLE IF NOT EXISTS citas (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      servicio VARCHAR(120) NOT NULL,
      fecha DATE NOT NULL,
      hora TIME NOT NULL,
      notas TEXT,
      estado ENUM(\'solicitada\',\'confirmada\',\'completada\',\'cancelada\') DEFAULT \'solicitada\',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )');

    run_sql($pdo, 'CREATE TABLE IF NOT EXISTS cotizaciones (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      titulo VARCHAR(160) NOT NULL,
      detalle TEXT,
      monto DECIMAL(12,2) DEFAULT NULL,
      estado ENUM(\'borrador\',\'enviada\',\'en_revision\',\'aprobada\') DEFAULT \'enviada\',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )');

    run_sql($pdo, 'CREATE TABLE IF NOT EXISTS documentos (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      nombre VARCHAR(160) NOT NULL,
      tipo VARCHAR(80) NOT NULL,
      estado ENUM(\'pendiente\',\'recibido\',\'revisado\') DEFAULT \'pendiente\',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )');

    run_sql($pdo, 'CREATE TABLE IF NOT EXISTS mensajes (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL,
      telefono VARCHAR(40) DEFAULT NULL,
      asunto VARCHAR(160) NOT NULL,
      mensaje TEXT NOT NULL,
      user_id INT UNSIGNED DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');

    $check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute(['cliente@agencia.test']);
    if (!$check->fetch()) {
        $hash = password_hash('Cliente123', PASSWORD_DEFAULT);
        $pdo->prepare('INSERT INTO users (nombre, email, telefono, password_hash) VALUES (?, ?, ?, ?)')
            ->execute(['Ana Torres', 'cliente@agencia.test', '555-0101', $hash]);
        $id = (int) $pdo->lastInsertId();
        $pdo->prepare('INSERT INTO documentos (user_id, nombre, tipo, estado) VALUES (?, ?, ?, ?), (?, ?, ?, ?)')
            ->execute([$id, 'Identificación', 'identidad', 'recibido', $id, 'Contrato de asesoría', 'contrato', 'pendiente']);
        $pdo->prepare('INSERT INTO citas (user_id, servicio, fecha, hora, notas, estado) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([$id, 'Asesoría inicial', date('Y-m-d', strtotime('+3 days')), '10:00:00', 'Primera reunión con Sandra Díaz', 'confirmada']);
        $pdo->prepare('INSERT INTO cotizaciones (user_id, titulo, detalle, monto, estado) VALUES (?, ?, ?, ?, ?)')
            ->execute([$id, 'Paquete de trámite integral', 'Revisión de expediente y acompañamiento', 4500.00, 'en_revision']);
    }

    echo '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Instalación</title></head><body>';
    echo '<p>Base de datos lista. Usuario de prueba: <strong>cliente@agencia.test</strong> / <strong>Cliente123</strong></p>';
    echo '<p><a href="/agencia/">Ir al sitio</a></p></body></html>';
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Error de instalación: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
    echo '<p>Enciende MySQL en el panel de XAMPP. Usuario por defecto: root sin contraseña.</p>';
}

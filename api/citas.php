<?php

require __DIR__ . '/bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = db()->prepare('SELECT * FROM citas WHERE user_id = ? ORDER BY fecha DESC, hora DESC');
    $stmt->execute([(int) $user['id']]);
    json_ok(['citas' => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $input = read_json();
    $servicio = trim((string) ($input['servicio'] ?? ''));
    $fecha = trim((string) ($input['fecha'] ?? ''));
    $hora = trim((string) ($input['hora'] ?? ''));
    $notas = trim((string) ($input['notas'] ?? ''));

    if ($servicio === '' || $fecha === '' || $hora === '') {
        json_error('Elige servicio, fecha y hora.');
    }

    $stmt = db()->prepare('INSERT INTO citas (user_id, servicio, fecha, hora, notas) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([(int) $user['id'], $servicio, $fecha, $hora, $notas ?: null]);

    json_ok(['id' => (int) db()->lastInsertId()], 201);
}

json_error('Método no permitido', 405);

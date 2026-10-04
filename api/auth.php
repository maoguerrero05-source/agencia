<?php

require __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? '';
$input = read_json();

if ($action === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    json_ok(['user' => current_user()]);
}

if ($action === 'logout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    json_ok(['user' => null]);
}

if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = trim((string) ($input['nombre'] ?? ''));
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $telefono = trim((string) ($input['telefono'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    if ($nombre === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        json_error('Completa nombre, correo válido y una clave de al menos 8 caracteres.');
    }

    $exists = db()->prepare('SELECT id FROM users WHERE email = ?');
    $exists->execute([$email]);
    if ($exists->fetch()) {
        json_error('Ese correo ya está registrado.');
    }

    $stmt = db()->prepare('INSERT INTO users (nombre, email, telefono, password_hash) VALUES (?, ?, ?, ?)');
    $stmt->execute([$nombre, $email, $telefono ?: null, password_hash($password, PASSWORD_DEFAULT)]);
    $id = (int) db()->lastInsertId();

    $seed = db()->prepare('INSERT INTO documentos (user_id, nombre, tipo, estado) VALUES (?, ?, ?, ?), (?, ?, ?, ?)');
    $seed->execute([
        $id, 'Identificación', 'identidad', 'pendiente',
        $id, 'Contrato de asesoría', 'contrato', 'pendiente',
    ]);

    $_SESSION['user_id'] = $id;
    json_ok(['user' => current_user()], 201);
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $password = (string) ($input['password'] ?? '');

    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $row = $stmt->fetch();

    if (!$row || !password_verify($password, $row['password_hash'])) {
        json_error('Correo o contraseña incorrectos.', 401);
    }

    $_SESSION['user_id'] = (int) $row['id'];
    json_ok(['user' => current_user()]);
}

json_error('Acción no válida', 404);

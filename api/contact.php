<?php

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

$input = read_json();
$nombre = trim((string) ($input['nombre'] ?? ''));
$email = strtolower(trim((string) ($input['email'] ?? '')));
$telefono = trim((string) ($input['telefono'] ?? ''));
$asunto = trim((string) ($input['asunto'] ?? ''));
$mensaje = trim((string) ($input['mensaje'] ?? ''));

if ($nombre === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $asunto === '' || $mensaje === '') {
    json_error('Completa nombre, correo, asunto y mensaje.');
}

$user = current_user();
$stmt = db()->prepare('INSERT INTO mensajes (nombre, email, telefono, asunto, mensaje, user_id) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$nombre, $email, $telefono ?: null, $asunto, $mensaje, $user['id'] ?? null]);

json_ok(['id' => (int) db()->lastInsertId()], 201);

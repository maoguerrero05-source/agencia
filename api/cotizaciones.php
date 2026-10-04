<?php

require __DIR__ . '/bootstrap.php';

$user = require_user();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Método no permitido', 405);
}

$input = read_json();
$titulo = trim((string) ($input['titulo'] ?? ''));
$detalle = trim((string) ($input['detalle'] ?? ''));

if ($titulo === '' || $detalle === '') {
    json_error('Indica un título y el detalle de lo que necesitas.');
}

$stmt = db()->prepare('INSERT INTO cotizaciones (user_id, titulo, detalle, estado) VALUES (?, ?, ?, ?)');
$stmt->execute([(int) $user['id'], $titulo, $detalle, 'enviada']);

json_ok(['id' => (int) db()->lastInsertId()], 201);

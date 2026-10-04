<?php

require __DIR__ . '/bootstrap.php';

$user = require_user();
$pdo = db();
$id = (int) $user['id'];

$citas = $pdo->prepare('SELECT * FROM citas WHERE user_id = ? ORDER BY fecha DESC, hora DESC');
$citas->execute([$id]);

$docs = $pdo->prepare('SELECT * FROM documentos WHERE user_id = ? ORDER BY created_at DESC');
$docs->execute([$id]);

$cots = $pdo->prepare('SELECT * FROM cotizaciones WHERE user_id = ? ORDER BY created_at DESC');
$cots->execute([$id]);

json_ok([
    'user' => $user,
    'citas' => $citas->fetchAll(),
    'documentos' => $docs->fetchAll(),
    'cotizaciones' => $cots->fetchAll(),
    'opciones' => [
        ['id' => 'cita', 'titulo' => 'Agendar cita', 'texto' => 'Reserva un espacio con Sandra Díaz.'],
        ['id' => 'documentos', 'titulo' => 'Mis documentos', 'texto' => 'Revisa lo que falta por entregar.'],
        ['id' => 'cotizacion', 'titulo' => 'Pedir cotización', 'texto' => 'Describe lo que necesitas y te respondemos.'],
        ['id' => 'perfil', 'titulo' => 'Mi perfil', 'texto' => 'Datos de contacto y acceso.'],
    ],
]);

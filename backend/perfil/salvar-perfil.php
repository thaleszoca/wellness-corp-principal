<?php
// =====================================================
//  Salva o perfil do usuário (as 5 perguntas essenciais) na tabela `perfil`.
//  Consumido via fetch em perguntas-essenciais.js ao finalizar.
//  Só grava se o usuário estiver logado (sessão criada no login/cadastro).
//  Como há UNIQUE em id_usuario, cada usuário mantém UMA linha (o perfil atual):
//  se já existir, atualiza (ON DUPLICATE KEY UPDATE).
// =====================================================
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once __DIR__ . '/../config/conexao.php';

function responder($sucesso, $mensagem, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode(['sucesso' => $sucesso, 'mensagem' => $mensagem]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método inválido.', 405);
}

// Precisa estar logado — o id do usuário vem da sessão, nunca do formulário
if (empty($_SESSION['usuario_id'])) {
    responder(false, 'Usuário não autenticado.', 401);
}

$idUsuario = $_SESSION['usuario_id'];
$idade     = (int)   ($_POST['idade']    ?? 0);
$sexo      = trim    ($_POST['sexo']      ?? '');
$altura    = (int)   ($_POST['altura']   ?? 0);
$peso      = (float) ($_POST['peso']     ?? 0);
$imc       = (float) ($_POST['imc']      ?? 0);
$objetivo  = trim    ($_POST['objetivo'] ?? '');

if ($idade <= 0 || $sexo === '' || $altura <= 0 || $peso <= 0 || $objetivo === '') {
    responder(false, 'Dados do perfil incompletos.', 400);
}

try {
    // Prepared statement (evita SQL injection).
    // ON DUPLICATE KEY UPDATE: se o usuário já tem perfil, atualiza em vez de duplicar.
    $stmt = $pdo->prepare(
        'INSERT INTO perfil (id_usuario, idade, sexo, altura, peso, imc, objetivo)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            idade = VALUES(idade), sexo = VALUES(sexo), altura = VALUES(altura),
            peso = VALUES(peso), imc = VALUES(imc), objetivo = VALUES(objetivo)'
    );
    $stmt->execute([$idUsuario, $idade, $sexo, $altura, $peso, $imc, $objetivo]);

    responder(true, 'Perfil salvo com sucesso!');
} catch (PDOException $e) {
    error_log('Erro ao salvar perfil: ' . $e->getMessage());
    responder(false, 'Erro ao salvar o perfil.', 500);
}

<?php
// Login de usuário — responde em JSON (consumido via fetch no login.js)
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

$email = trim($_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';

if ($email === '' || $senha === '') {
    responder(false, 'Preencha e-mail e senha.', 400);
}

try {
    // Busca o usuário pelo e-mail
    $stmt = $pdo->prepare('SELECT id, nome, senha FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    // Verifica se existe e se a senha confere com o hash salvo
    if ($usuario && password_verify($senha, $usuario['senha'])) {
        // Guarda os dados na sessão para manter o usuário logado
        $_SESSION['usuario_id']   = $usuario['id'];
        $_SESSION['usuario_nome'] = $usuario['nome'];

        responder(true, 'Login realizado com sucesso!');
    } else {
        // Mensagem genérica de propósito (não revela se o e-mail existe)
        responder(false, 'E-mail ou senha incorretos.', 401);
    }
} catch (PDOException $e) {
    responder(false, 'Erro ao fazer login: ' . $e->getMessage(), 500);
}

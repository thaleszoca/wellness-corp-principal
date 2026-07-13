<?php
// Cadastro de novo usuário — responde em JSON (consumido via fetch no cadastro.js)
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexao.php';

// Função auxiliar para responder e encerrar
function responder($sucesso, $mensagem, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode(['sucesso' => $sucesso, 'mensagem' => $mensagem]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método inválido.', 405);
}

// Pega os dados do formulário e remove espaços das pontas
$nome  = trim($_POST['nome']  ?? '');
$email = trim($_POST['email'] ?? '');
$senha = $_POST['senha'] ?? '';

// Validação
if ($nome === '' || $email === '' || $senha === '') {
    responder(false, 'Preencha todos os campos.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(false, 'E-mail inválido.', 400);
}

try {
    // Verifica se o e-mail já está cadastrado
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        responder(false, 'Este e-mail já está cadastrado.', 409);
    }

    // Criptografa a senha (NUNCA salve senha em texto puro)
    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    // Insere usando prepared statement (evita SQL injection)
    $stmt = $pdo->prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    $stmt->execute([$nome, $email, $senhaHash]);

    responder(true, 'Usuário cadastrado com sucesso!');
} catch (PDOException $e) {
    responder(false, 'Erro ao cadastrar: ' . $e->getMessage(), 500);
}

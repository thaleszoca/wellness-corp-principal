<?php
// =====================================================
//  Salva o resultado do questionário na tabela `dieta`.
//  Consumido via fetch em perguntas-adaptativas.js ao finalizar as 40 perguntas.
//  Só grava se o usuário estiver logado (sessão criada no login.php).
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

$idUsuario    = $_SESSION['usuario_id'];
$objetivo     = trim($_POST['objetivo']     ?? '');
$categoria    = trim($_POST['categoria']    ?? '');
$subcategoria = trim($_POST['subcategoria'] ?? '');
$dieta        = trim($_POST['dieta']        ?? '');
$pontuacao    = trim($_POST['pontuacao']    ?? '');

if ($objetivo === '' || $categoria === '' || $subcategoria === '' || $dieta === '') {
    responder(false, 'Dados da dieta incompletos.', 400);
}

try {
    // Prepared statement (evita SQL injection). A coluna `data` se preenche
    // sozinha pelo DEFAULT CURRENT_TIMESTAMP.
    $stmt = $pdo->prepare(
        'INSERT INTO dieta (id_usuario, objetivo, categoria, subcategoria, dieta, pontuacao)
         VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([$idUsuario, $objetivo, $categoria, $subcategoria, $dieta, $pontuacao]);

    responder(true, 'Dieta salva com sucesso!');
} catch (PDOException $e) {
    // Não expõe o erro real ao cliente (só registra no log do servidor)
    error_log('Erro ao salvar dieta: ' . $e->getMessage());
    responder(false, 'Erro ao salvar a dieta.', 500);
}

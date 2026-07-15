<?php
// =====================================================
//  Login / cadastro via Google (OAuth 2.0)
//  Recebe o access_token do navegador, valida com o Google,
//  e cria ou loga o usuário na tabela `usuarios`.
// =====================================================
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../config/google.php';

function responder($sucesso, $mensagem, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode(['sucesso' => $sucesso, 'mensagem' => $mensagem]);
    exit;
}

// Faz uma requisição GET e devolve o JSON decodificado (ou null se falhar)
function httpGetJson($url, $bearer = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    if ($bearer) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $bearer]);
    }
    $resposta = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status !== 200 || $resposta === false) {
        return null;
    }
    return json_decode($resposta, true);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método inválido.', 405);
}

$accessToken = trim($_POST['access_token'] ?? '');
if ($accessToken === '') {
    responder(false, 'Token do Google não recebido.', 400);
}

// 1) Valida o token no Google e confere se foi emitido para o NOSSO app
$info = httpGetJson('https://oauth2.googleapis.com/tokeninfo?access_token=' . urlencode($accessToken));
if (!$info || empty($info['aud']) || $info['aud'] !== GOOGLE_CLIENT_ID) {
    responder(false, 'Token do Google inválido.', 401);
}

// 2) Busca os dados do perfil (nome, e-mail, id do Google)
$perfil = httpGetJson('https://www.googleapis.com/oauth2/v3/userinfo', $accessToken);
if (!$perfil || empty($perfil['email']) || empty($perfil['sub'])) {
    responder(false, 'Não foi possível obter os dados do Google.', 502);
}

$googleId = $perfil['sub'];
$email    = $perfil['email'];
$nome     = $perfil['name'] ?? $email;

try {
    // Procura o usuário pelo google_id OU pelo e-mail (caso já tenha se cadastrado com senha antes)
    $stmt = $pdo->prepare('SELECT id, nome, google_id FROM usuarios WHERE google_id = ? OR email = ? LIMIT 1');
    $stmt->execute([$googleId, $email]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        // Já existe: se entrou por e-mail mas ainda não tinha google_id, vincula agora
        if (empty($usuario['google_id'])) {
            $upd = $pdo->prepare('UPDATE usuarios SET google_id = ? WHERE id = ?');
            $upd->execute([$googleId, $usuario['id']]);
        }
        $usuarioId   = $usuario['id'];
        $usuarioNome = $usuario['nome'];
    } else {
        // Novo usuário via Google — sem senha (senha fica NULL)
        $ins = $pdo->prepare('INSERT INTO usuarios (nome, email, google_id) VALUES (?, ?, ?)');
        $ins->execute([$nome, $email, $googleId]);
        $usuarioId   = $pdo->lastInsertId();
        $usuarioNome = $nome;
    }

    // Cria a sessão (mesma lógica do login normal)
    $_SESSION['usuario_id']   = $usuarioId;
    $_SESSION['usuario_nome'] = $usuarioNome;

    responder(true, 'Login com Google realizado com sucesso!');
} catch (PDOException $e) {
    responder(false, 'Erro ao entrar com Google: ' . $e->getMessage(), 500);
}

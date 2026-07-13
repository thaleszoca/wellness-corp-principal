<?php
// Configuração da conexão com o banco de dados MySQL (XAMPP)

$host   = 'localhost';   // servidor do banco
$dbname = 'wellness';    // nome do banco de dados
$user   = 'root';        // usuário padrão do XAMPP
$senha  = '';            // senha padrão do XAMPP é vazia

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $senha);
    // Faz o PDO lançar exceções em caso de erro (facilita achar problemas)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Retorna os resultados como array associativo por padrão
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Em produção, evite mostrar a mensagem real do erro ao usuário
    die('Erro na conexão com o banco de dados: ' . $e->getMessage());
}

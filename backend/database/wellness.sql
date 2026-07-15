-- =====================================================
--  Banco de dados: wellness
--  Importe este arquivo no phpMyAdmin para criar o banco
--  e a tabela necessários para o projeto rodar.
-- =====================================================

-- Cria o banco de dados (se ainda não existir) e seleciona ele
CREATE DATABASE IF NOT EXISTS `wellness`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE `wellness`;

-- -----------------------------------------------------
--  Tabela: usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id`        INT(11)      NOT NULL AUTO_INCREMENT,
    `nome`      VARCHAR(100) NOT NULL,
    `email`     VARCHAR(100) NOT NULL,
    `senha`     VARCHAR(255) NULL,              -- NULL para quem entra pelo Google (não tem senha)
    `google_id` VARCHAR(50)  NULL,              -- id do usuário no Google (só para logins Google)
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `dieta` {
    `id`            INT(11) NOT NULL AUTO_INCREMENT,
    `id_usuario`    VARCHAR(100) NOT NULL, 
    `objetivo`      VARCHAR (100) NOT NULL, 
    `categoria`     VARCHAR (255) NOT NULL,
    `subcategoria`  VARCHAR (150) NOT NULL,
    `dieta`         VARCHAR (100) NOT NULL,
    `pontuacao`     VARCHAR (100) NOT NULL,
    `data`          VARCHAR (100) NOT NULL,
}

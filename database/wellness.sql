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
    `id`    INT(11)      NOT NULL AUTO_INCREMENT,
    `nome`  VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE IF NOT EXISTS `dieta` (
    `id`            INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_usuario`    INT(11)      NOT NULL,
    `objetivo`      VARCHAR(100) NOT NULL,
    `categoria`     VARCHAR(255) NOT NULL,
    `subcategoria`  VARCHAR(150) NOT NULL,
    `dieta`         VARCHAR(100) NOT NULL,
    `pontuacao`     VARCHAR(100) NOT NULL,
    `data`          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Liga a dieta ao usuário dono dela (garante que só grava dieta de usuário existente).
ALTER TABLE `dieta` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`);

-- -----------------------------------------------------
--  Tabela: perfil  (dados das 5 perguntas essenciais)
--  UNIQUE em id_usuario → cada usuário tem só UMA linha (o perfil atual).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `perfil` (
    `id`         INT(11)      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `id_usuario` INT(11)      NOT NULL,
    `idade`      INT(11)      NOT NULL,
    `sexo`       VARCHAR(20)  NOT NULL,
    `altura`     INT(11)      NOT NULL,
    `peso`       DECIMAL(5,2) NOT NULL,
    `imc`        DECIMAL(5,2) NOT NULL,
    `objetivo`   VARCHAR(100) NOT NULL,
    UNIQUE KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Liga o perfil ao usuário dono dele.
ALTER TABLE `perfil` ADD FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`);




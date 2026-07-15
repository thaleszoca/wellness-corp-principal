-- =====================================================
--  Migração: adiciona suporte a Login com Google
--  Rode este script UMA VEZ no phpMyAdmin (aba SQL),
--  com o banco `wellness` selecionado.
--  (Só é necessário se você JÁ tinha a tabela `usuarios`
--   criada antes. Bancos novos já vêm com isso pelo wellness.sql.)
-- =====================================================

USE `wellness`;

-- Permite senha vazia (usuários que entram pelo Google não têm senha)
ALTER TABLE `usuarios` MODIFY `senha` VARCHAR(255) NULL;

-- Adiciona a coluna do id do Google
ALTER TABLE `usuarios` ADD COLUMN `google_id` VARCHAR(50) NULL AFTER `senha`;

-- Garante que dois usuários não usem o mesmo Google
ALTER TABLE `usuarios` ADD UNIQUE KEY `google_id` (`google_id`);

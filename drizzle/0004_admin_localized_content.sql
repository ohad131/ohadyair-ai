ALTER TABLE `users` ADD `passwordHash` varchar(255);

ALTER TABLE `siteContent` ADD `language` enum('he','en') NOT NULL DEFAULT 'he';
UPDATE `siteContent` SET `language` = 'he' WHERE `language` IS NULL;
ALTER TABLE `siteContent` DROP INDEX `siteContent_key_unique`;
ALTER TABLE `siteContent` ADD CONSTRAINT `siteContent_key_language_unique` UNIQUE (`key`, `language`);

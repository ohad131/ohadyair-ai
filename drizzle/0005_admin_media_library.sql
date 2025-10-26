CREATE TABLE `images` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `fileName` varchar(255) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `data` longtext NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

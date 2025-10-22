CREATE TABLE `aiTools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`url` varchar(500) NOT NULL,
	`color` varchar(50) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `aiTools_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `siteContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteContent_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `isFeatured` boolean DEFAULT false NOT NULL;
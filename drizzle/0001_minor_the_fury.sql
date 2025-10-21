CREATE TABLE `blogPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`coverImage` varchar(500),
	`author` varchar(255) NOT NULL,
	`publishedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`isPublished` boolean NOT NULL DEFAULT true,
	`views` int NOT NULL DEFAULT 0,
	CONSTRAINT `blogPosts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blogPosts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `contactSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`message` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`isRead` boolean NOT NULL DEFAULT false,
	CONSTRAINT `contactSubmissions_id` PRIMARY KEY(`id`)
);

CREATE TABLE `crm_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`color` varchar(20) NOT NULL DEFAULT '#8B6F47',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crm_tags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lead_tags` (
	`lead_id` int NOT NULL,
	`tag_id` int NOT NULL
);

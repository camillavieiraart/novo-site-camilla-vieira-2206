CREATE TABLE `lead_forms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` varchar(64) NOT NULL,
	`lead_id` int NOT NULL,
	`lead_name` varchar(255) NOT NULL,
	`form_type` enum('onboarding','satisfacao') NOT NULL,
	`status` enum('pending','filled') NOT NULL DEFAULT 'pending',
	`responses` json,
	`opened_at` bigint,
	`filled_at` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lead_forms_id` PRIMARY KEY(`id`),
	CONSTRAINT `lead_forms_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(30),
	`email` varchar(320),
	`city` varchar(100),
	`instagram` varchar(100),
	`service_interest` varchar(50) NOT NULL DEFAULT 'ensaio',
	`stage` enum('lead_frio','lead_quente','negociando','fechado','perdido') NOT NULL DEFAULT 'lead_frio',
	`source` varchar(50) NOT NULL DEFAULT 'manual',
	`notes` text,
	`last_contact` bigint,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);

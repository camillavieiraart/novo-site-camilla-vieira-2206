CREATE TABLE `email_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`newsletterId` int NOT NULL,
	`subscriberEmail` varchar(320) NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`linkUrl` text,
	`userAgent` text,
	`ipAddress` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletters_sent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subject` varchar(300) NOT NULL,
	`previewText` varchar(200),
	`topic` text,
	`htmlContent` text NOT NULL,
	`recipientCount` int DEFAULT 0,
	`status` varchar(50) DEFAULT 'sent',
	`resendBatchId` varchar(200),
	`scheduledDay` varchar(20),
	`scheduledHour` int,
	`openCount` int DEFAULT 0,
	`clickCount` int DEFAULT 0,
	`unsubscribeCount` int DEFAULT 0,
	`openRate` decimal(5,2) DEFAULT '0.00',
	`clickRate` decimal(5,2) DEFAULT '0.00',
	`unsubscribeRate` decimal(5,2) DEFAULT '0.00',
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletters_sent_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `frequencyPreference` enum('semanal','quinzenal') DEFAULT 'semanal';--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `unsubscribeToken` varchar(64);--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `totalEmailsReceived` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `totalOpens` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `totalClicks` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `lastOpenedAt` timestamp;--> statement-breakpoint
ALTER TABLE `newsletter_subscribers` ADD `lastClickedAt` timestamp;
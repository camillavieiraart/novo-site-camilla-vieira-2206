CREATE TABLE `artwork_variants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artworkId` int NOT NULL,
	`size` varchar(50) NOT NULL,
	`finish` enum('canvas','fine_art') NOT NULL DEFAULT 'fine_art',
	`priceInCents` int NOT NULL,
	`stripePriceId` varchar(100),
	`stripeProductId` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	CONSTRAINT `artwork_variants_id` PRIMARY KEY(`id`)
);

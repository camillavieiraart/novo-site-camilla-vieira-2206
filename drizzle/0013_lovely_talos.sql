ALTER TABLE `blog_posts` ADD `language` varchar(10) DEFAULT 'pt';--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `translationGroupId` varchar(100);--> statement-breakpoint
ALTER TABLE `testimonials` ADD `isPending` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `sourceType` varchar(50) DEFAULT 'admin';--> statement-breakpoint
ALTER TABLE `testimonials` ADD `email` varchar(320);--> statement-breakpoint
ALTER TABLE `testimonials` ADD `sessionType` varchar(200);
ALTER TABLE `leads` ADD `funnel_step` enum('visualizou_pacote','preencheu_dados','escolheu_datas','iniciou_pagamento','pagou','agendou_call');--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_package` varchar(100);--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_package_type` varchar(50);--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_package_price` int;--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_preferred_dates` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_period` varchar(50);--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_expectations` text;--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_stripe_pi` varchar(100);--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_paid_at` timestamp;--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_call_scheduled_at` timestamp;--> statement-breakpoint
ALTER TABLE `leads` ADD `funnel_last_event_at` timestamp DEFAULT (now());
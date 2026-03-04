CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`whatsapp` varchar(30) NOT NULL,
	`city` varchar(100),
	`profession` varchar(255),
	`niche` varchar(255),
	`instagram` varchar(100),
	`linkedin` varchar(255),
	`shootingObjective` text,
	`numberOfPeople` int NOT NULL DEFAULT 1,
	`howDidYouFindUs` varchar(100),
	`notes` text,
	`stripeCustomerId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crmNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`content` text NOT NULL,
	`noteType` enum('note','call','email','whatsapp','meeting','stage_change') NOT NULL DEFAULT 'note',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `crmNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `deliverables` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`itemName` varchar(255) NOT NULL,
	`itemType` enum('fotos','video_40s','videos_audio','filmagem','analise_instagram','ideias_posts','calendario','guia_pdf','mentoria','consultoria','roteiro_video','suporte_whatsapp') NOT NULL,
	`deadlineDays` int,
	`dueDate` timestamp,
	`status` enum('pending','in_progress','completed','delivered') NOT NULL DEFAULT 'pending',
	`completedAt` timestamp,
	`deliveredAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliverables_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professional_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`productType` varchar(50) NOT NULL,
	`productName` varchar(255) NOT NULL,
	`basePrice` int NOT NULL,
	`numberOfPeople` int NOT NULL DEFAULT 1,
	`discountAmount` int NOT NULL DEFAULT 0,
	`totalPrice` int NOT NULL,
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`paymentMethod` enum('card','pix'),
	`stripePaymentIntentId` varchar(255),
	`stripeCheckoutSessionId` varchar(255),
	`paidAt` timestamp,
	`crmStage` enum('novo_lead','contato_feito','briefing_enviado','ensaio_agendado','ensaio_realizado','em_edicao','entrega_feita','concluido','cancelado') NOT NULL DEFAULT 'novo_lead',
	`shootingDate` timestamp,
	`consultationDate` timestamp,
	`googleCalendarEventId` varchar(255),
	`googleMeetLink` varchar(500),
	`internalNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professional_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `professional_orders_stripeCheckoutSessionId_unique` UNIQUE(`stripeCheckoutSessionId`)
);

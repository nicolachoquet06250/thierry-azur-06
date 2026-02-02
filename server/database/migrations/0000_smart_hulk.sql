CREATE TABLE `about` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subtitle` varchar(255) NOT NULL,
	`history_section_title` varchar(255) NOT NULL,
	`history_section_content` longtext NOT NULL,
	`values_section_title` varchar(255) NOT NULL,
	`image_name` varchar(255),
	`image_size` float,
	`image_type` varchar(50),
	`image_content` longblob,
	CONSTRAINT `about_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `about_values` (
	`id` int AUTO_INCREMENT NOT NULL,
	`about_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	CONSTRAINT `about_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` longtext NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `devis_asks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`message` longtext NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `devis_asks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`contact_email` varchar(255) NOT NULL,
	`devis_email` varchar(255) NOT NULL,
	`schedules` varchar(255) NOT NULL,
	`image_hero_name` varchar(255),
	`image_hero_size` float,
	`image_hero_type` varchar(50),
	`image_hero_content` longblob,
	`image_zones_name` varchar(255),
	`image_zones_size` float,
	`image_zones_type` varchar(50),
	`image_zones_content` longblob,
	CONSTRAINT `metadata_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullname` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`type` enum('particulier','professionnel','immeuble','copropriete') NOT NULL,
	`city` enum('Nice','Antibes','Cannes','Cagnes','Grasse') NOT NULL,
	`message` text,
	`note` float NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `about_values` ADD CONSTRAINT `about_values_about_id_about_id_fk` FOREIGN KEY (`about_id`) REFERENCES `about`(`id`) ON DELETE no action ON UPDATE no action;
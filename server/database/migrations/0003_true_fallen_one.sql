CREATE TABLE `cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `notes` RENAME COLUMN `city` TO `city_id`;--> statement-breakpoint
ALTER TABLE `notes` MODIFY COLUMN `city_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `notes` ADD CONSTRAINT `notes_city_id_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE no action ON UPDATE no action;
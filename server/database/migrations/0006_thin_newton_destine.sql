ALTER TABLE `about` ADD `reviews_section_title` varchar(255) DEFAULT 'Ils recommandent Thierry Azur 06' NOT NULL;--> statement-breakpoint
ALTER TABLE `about` ADD `reviews_section_subtitle` varchar(255) DEFAULT 'Avis clients sur Google' NOT NULL;--> statement-breakpoint
ALTER TABLE `about` ADD `reviews_section_rating` float DEFAULT 5 NOT NULL;
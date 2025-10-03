CREATE TABLE `japanese_words` (
	`id` text PRIMARY KEY NOT NULL,
	`word` text NOT NULL,
	`reading` text,
	`translation` text,
	`pronunciation` text,
	`example_sentence` text,
	`type` text,
	`notes` text,
	`status` text DEFAULT 'new' NOT NULL,
	`difficulty` text DEFAULT 'beginner' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `japanese_words_word_unique` ON `japanese_words` (`word`);
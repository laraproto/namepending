ALTER TABLE "panelGroups" DROP CONSTRAINT "panelGroups_game_group_id_gameGroups_id_fk";
--> statement-breakpoint
ALTER TABLE "panelGroups" ALTER COLUMN "game_group_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "panelGroups" ADD CONSTRAINT "panelGroups_game_group_id_gameGroups_id_fk" FOREIGN KEY ("game_group_id") REFERENCES "public"."gameGroups"("id") ON DELETE set null ON UPDATE no action;
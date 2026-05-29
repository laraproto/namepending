CREATE TABLE "playerStats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"time_total" bigint DEFAULT 0 NOT NULL,
	"time_this_week" integer DEFAULT 0 NOT NULL,
	"time_last_week" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "playerStats" ADD CONSTRAINT "playerStats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;
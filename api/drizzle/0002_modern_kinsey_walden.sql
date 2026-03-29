ALTER TABLE "user" ADD COLUMN "flags" bigint DEFAULT 0::bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_group_id_panelGroups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."panelGroups"("id") ON DELETE set null ON UPDATE no action;
CREATE TYPE "public"."banType" AS ENUM('temporary', 'permanent');--> statement-breakpoint
CREATE TYPE "public"."warnType" AS ENUM('minor', 'major', 'tempminor', 'tempmajor');--> statement-breakpoint
CREATE TABLE "accountLinkCodes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"player_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "accountLinkCodes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "gameGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(400),
	"permissions" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "gameGroupsInheritedGroups" (
	"owning_group_id" uuid NOT NULL,
	"owned_group_id" uuid NOT NULL,
	CONSTRAINT "gameGroupsInheritedGroups_owned_group_id_owning_group_id_pk" PRIMARY KEY("owned_group_id","owning_group_id")
);
--> statement-breakpoint
CREATE TABLE "lookup_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(64) NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"player_id" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "lookup_keys_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "panelGroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(400),
	"game_group_id" uuid NOT NULL,
	"permissions" bigint DEFAULT 4::bigint NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "panelGroupsInheritedGroups" (
	"owning_group" uuid NOT NULL,
	"owned_group" uuid NOT NULL,
	CONSTRAINT "panelGroupsInheritedGroups_owned_group_owning_group_pk" PRIMARY KEY("owned_group","owning_group")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" varchar(80) NOT NULL,
	"platform_id" varchar(256) NOT NULL,
	"do_not_track" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone,
	CONSTRAINT "players_platform_id_unique" UNIQUE("platform_id")
);
--> statement-breakpoint
CREATE TABLE "playerBans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" text,
	"victim_id" uuid NOT NULL,
	"reason" varchar(1000),
	"type" "banType" NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "playerWarns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_id" text,
	"victim_id" uuid NOT NULL,
	"reason" varchar(1000),
	"hidden" boolean DEFAULT false NOT NULL,
	"type" "warnType" NOT NULL,
	"expires_at" timestamp DEFAULT now() NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "serverApiKey" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(64) NOT NULL,
	"creator_id" text NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "serverApiKey_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "accountLinkCodes" ADD CONSTRAINT "accountLinkCodes_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameGroupsInheritedGroups" ADD CONSTRAINT "gameGroupsInheritedGroups_owning_group_id_gameGroups_id_fk" FOREIGN KEY ("owning_group_id") REFERENCES "public"."gameGroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gameGroupsInheritedGroups" ADD CONSTRAINT "gameGroupsInheritedGroups_owned_group_id_gameGroups_id_fk" FOREIGN KEY ("owned_group_id") REFERENCES "public"."gameGroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lookup_keys" ADD CONSTRAINT "lookup_keys_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panelGroups" ADD CONSTRAINT "panelGroups_game_group_id_gameGroups_id_fk" FOREIGN KEY ("game_group_id") REFERENCES "public"."gameGroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panelGroupsInheritedGroups" ADD CONSTRAINT "panelGroupsInheritedGroups_owning_group_panelGroups_id_fk" FOREIGN KEY ("owning_group") REFERENCES "public"."panelGroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "panelGroupsInheritedGroups" ADD CONSTRAINT "panelGroupsInheritedGroups_owned_group_panelGroups_id_fk" FOREIGN KEY ("owned_group") REFERENCES "public"."panelGroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players" ADD CONSTRAINT "players_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerBans" ADD CONSTRAINT "playerBans_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerBans" ADD CONSTRAINT "playerBans_victim_id_players_id_fk" FOREIGN KEY ("victim_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerWarns" ADD CONSTRAINT "playerWarns_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playerWarns" ADD CONSTRAINT "playerWarns_victim_id_players_id_fk" FOREIGN KEY ("victim_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "serverApiKey" ADD CONSTRAINT "serverApiKey_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
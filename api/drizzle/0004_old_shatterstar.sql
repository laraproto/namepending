ALTER TABLE "accountLinkCodes" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accountLinkCodes" ALTER COLUMN "expires_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "lookup_keys" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lookup_keys" ALTER COLUMN "expires_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "playerBans" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "playerBans" ALTER COLUMN "expires_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "serverApiKey" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "serverApiKey" ALTER COLUMN "created_at" SET DEFAULT now();
CREATE SCHEMA "resurexi";
--> statement-breakpoint
CREATE TYPE "resurexi"."site_content_key" AS ENUM('hero', 'about_preview', 'contact_info');--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_blog_post" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"subtitle" varchar(512),
	"coverImageUrl" varchar(2048),
	"content" text DEFAULT '' NOT NULL,
	"isMain" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT true NOT NULL,
	"metaTitle" varchar(512),
	"metaDescription" text,
	"ogImageUrl" varchar(2048),
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_category" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_contact_link" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"label" varchar(256) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"iconUrl" varchar(2048),
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_contact_request" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"company" varchar(256),
	"email" varchar(320) NOT NULL,
	"phone" varchar(64),
	"message" text NOT NULL,
	"isRead" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_site_content" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"key" "resurexi"."site_content_key" NOT NULL,
	"heroTitle" varchar(512),
	"heroSubtitle" varchar(1024),
	"heroGifUrl" varchar(2048),
	"heroWireframeUrl" varchar(2048),
	"heroWireframeColorUrl" varchar(2048),
	"aboutPreviewTitle" varchar(512),
	"aboutPreviewText" text,
	"aboutPreviewImageUrl" varchar(2048),
	"contactEmail" varchar(320),
	"responseTimeText" varchar(512),
	"basedInText" varchar(512),
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_work_category" (
	"workId" varchar(128) NOT NULL,
	"categoryId" varchar(128) NOT NULL,
	CONSTRAINT "_resurexi_work_category_workId_categoryId_pk" PRIMARY KEY("workId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_work_gallery_image" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"workId" varchar(128) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"alt" varchar(512),
	"order" integer DEFAULT 0 NOT NULL,
	"isAnimated" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_work_youtube_video" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"workId" varchar(128) NOT NULL,
	"url" varchar(2048) NOT NULL,
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resurexi"."_resurexi_work" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"subtitle" varchar(512),
	"description" text DEFAULT '' NOT NULL,
	"coverImageUrl" varchar(2048) NOT NULL,
	"coverIsAnimated" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"hidden" boolean DEFAULT true NOT NULL,
	"metaTitle" varchar(512),
	"metaDescription" text,
	"ogImageUrl" varchar(2048),
	"createdAt" timestamp with time zone NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resurexi"."_resurexi_work_category" ADD CONSTRAINT "_resurexi_work_category_workId__resurexi_work_id_fk" FOREIGN KEY ("workId") REFERENCES "resurexi"."_resurexi_work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resurexi"."_resurexi_work_category" ADD CONSTRAINT "_resurexi_work_category_categoryId__resurexi_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "resurexi"."_resurexi_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resurexi"."_resurexi_work_gallery_image" ADD CONSTRAINT "_resurexi_work_gallery_image_workId__resurexi_work_id_fk" FOREIGN KEY ("workId") REFERENCES "resurexi"."_resurexi_work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resurexi"."_resurexi_work_youtube_video" ADD CONSTRAINT "_resurexi_work_youtube_video_workId__resurexi_work_id_fk" FOREIGN KEY ("workId") REFERENCES "resurexi"."_resurexi_work"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_post_slug_idx" ON "resurexi"."_resurexi_blog_post" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "category_slug_idx" ON "resurexi"."_resurexi_category" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "site_content_key_idx" ON "resurexi"."_resurexi_site_content" USING btree ("key");--> statement-breakpoint
CREATE INDEX "work_gallery_image_work_id_idx" ON "resurexi"."_resurexi_work_gallery_image" USING btree ("workId");--> statement-breakpoint
CREATE INDEX "work_youtube_video_work_id_idx" ON "resurexi"."_resurexi_work_youtube_video" USING btree ("workId");--> statement-breakpoint
CREATE UNIQUE INDEX "work_slug_idx" ON "resurexi"."_resurexi_work" USING btree ("slug");
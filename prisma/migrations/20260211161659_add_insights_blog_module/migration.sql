-- CreateEnum
CREATE TYPE "InsightPostStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "insight_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insight_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_category_translations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "insight_category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insight_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_post_translations" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "status" "InsightPostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL DEFAULT '',
    "bodyMarkdown" TEXT NOT NULL DEFAULT '',
    "coverImageUrl" TEXT,
    "coverImageAlt" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "readTimeMinutes" INTEGER,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insight_post_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insight_categories_key_key" ON "insight_categories"("key");

-- CreateIndex
CREATE UNIQUE INDEX "insight_category_translations_categoryId_localeCode_key" ON "insight_category_translations"("categoryId", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "insight_posts_slug_key" ON "insight_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "insight_post_translations_postId_locale_key" ON "insight_post_translations"("postId", "locale");

-- AddForeignKey
ALTER TABLE "insight_category_translations" ADD CONSTRAINT "insight_category_translations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "insight_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_posts" ADD CONSTRAINT "insight_posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "insight_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_post_translations" ADD CONSTRAINT "insight_post_translations_postId_fkey" FOREIGN KEY ("postId") REFERENCES "insight_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

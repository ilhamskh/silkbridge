-- CreateTable
CREATE TABLE "faq_groups" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_item_translations" (
    "id" TEXT NOT NULL,
    "faqItemId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "faq_item_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faq_groups_key_key" ON "faq_groups"("key");

-- CreateIndex
CREATE UNIQUE INDEX "faq_item_translations_faqItemId_localeCode_key" ON "faq_item_translations"("faqItemId", "localeCode");

-- AddForeignKey
ALTER TABLE "faq_items" ADD CONSTRAINT "faq_items_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "faq_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_item_translations" ADD CONSTRAINT "faq_item_translations_faqItemId_fkey" FOREIGN KEY ("faqItemId") REFERENCES "faq_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "InquiryType" AS ENUM ('PHARMA', 'PATIENT', 'WELLNESS');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'ARCHIVED', 'SPAM');

-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "contact_recipients" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_routing_rules" (
    "id" TEXT NOT NULL,
    "type" "InquiryType" NOT NULL,
    "recipientId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_routing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "type" "InquiryType" NOT NULL,
    "message" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "pagePath" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "location" TEXT,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "websiteUrl" TEXT,
    "status" "PartnerStatus" NOT NULL DEFAULT 'ACTIVE',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_translations" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "partner_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_routing_rules_type_key" ON "contact_routing_rules"("type");

-- CreateIndex
CREATE UNIQUE INDEX "partner_translations_partnerId_localeCode_key" ON "partner_translations"("partnerId", "localeCode");

-- AddForeignKey
ALTER TABLE "contact_routing_rules" ADD CONSTRAINT "contact_routing_rules_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "contact_recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_translations" ADD CONSTRAINT "partner_translations_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

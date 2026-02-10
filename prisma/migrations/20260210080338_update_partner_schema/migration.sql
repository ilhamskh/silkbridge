/*
  Warnings:

  - The values [PHARMA,WELLNESS] on the enum `InquiryType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `images` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the column `specialties` on the `partners` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `partners` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PartnerCategory" AS ENUM ('GOVERNMENT', 'HOSPITAL', 'PHARMA', 'INVESTOR', 'ASSOCIATION');

-- AlterEnum
BEGIN;
CREATE TYPE "InquiryType_new" AS ENUM ('PATIENT', 'TOUR', 'BUSINESS');
ALTER TABLE "contact_routing_rules" ALTER COLUMN "type" TYPE "InquiryType_new" USING ("type"::text::"InquiryType_new");
ALTER TABLE "contact_submissions" ALTER COLUMN "type" TYPE "InquiryType_new" USING ("type"::text::"InquiryType_new");
ALTER TYPE "InquiryType" RENAME TO "InquiryType_old";
ALTER TYPE "InquiryType_new" RENAME TO "InquiryType";
DROP TYPE "public"."InquiryType_old";
COMMIT;

-- AlterTable
ALTER TABLE "partner_translations" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "partners" DROP COLUMN "images",
DROP COLUMN "location",
DROP COLUMN "specialties",
DROP COLUMN "status",
ADD COLUMN     "category" "PartnerCategory" NOT NULL DEFAULT 'ASSOCIATION',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "PartnerStatus";

-- CreateTable
CREATE TABLE "gallery_groups" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "images" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_groups_key_key" ON "gallery_groups"("key");

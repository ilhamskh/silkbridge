/*
  Warnings:

  - You are about to drop the column `location` on the `partner_translations` table. All the data in the column will be lost.
  - You are about to drop the column `specialties` on the `partner_translations` table. All the data in the column will be lost.
  - You are about to drop the column `coverPhoto` on the `partners` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PartnerCategory" ADD VALUE 'HOTEL';
ALTER TYPE "PartnerCategory" ADD VALUE 'AIRLINE';
ALTER TYPE "PartnerCategory" ADD VALUE 'TRANSPORT';
ALTER TYPE "PartnerCategory" ADD VALUE 'TOURISM';
ALTER TYPE "PartnerCategory" ADD VALUE 'TECHNOLOGY';

-- AlterTable
ALTER TABLE "partner_translations" DROP COLUMN "location",
DROP COLUMN "specialties";

-- AlterTable
ALTER TABLE "partners" DROP COLUMN "coverPhoto",
ADD COLUMN     "coverPhotoAlt" TEXT,
ADD COLUMN     "coverPhotoUrl" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];

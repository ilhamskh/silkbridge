-- AlterTable
ALTER TABLE "partner_translations" ADD COLUMN     "location" TEXT,
ADD COLUMN     "specialties" TEXT;

-- AlterTable
ALTER TABLE "partners" ADD COLUMN     "coverPhoto" TEXT;

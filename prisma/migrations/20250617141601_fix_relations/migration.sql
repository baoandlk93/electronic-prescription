/*
  Warnings:

  - You are about to drop the column `diagnosisId` on the `prescription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `prescription` DROP FOREIGN KEY `Prescription_diagnosisId_fkey`;

-- DropIndex
DROP INDEX `Prescription_diagnosisId_fkey` ON `prescription`;

-- AlterTable
ALTER TABLE `prescription` DROP COLUMN `diagnosisId`;

-- CreateTable
CREATE TABLE `PrescriptionDiagnosis` (
    `prescriptionId` INTEGER NOT NULL,
    `diagnosisId` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,

    PRIMARY KEY (`prescriptionId`, `diagnosisId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PrescriptionDiagnosis` ADD CONSTRAINT `PrescriptionDiagnosis_prescriptionId_fkey` FOREIGN KEY (`prescriptionId`) REFERENCES `Prescription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrescriptionDiagnosis` ADD CONSTRAINT `PrescriptionDiagnosis_diagnosisId_fkey` FOREIGN KEY (`diagnosisId`) REFERENCES `Diagnosis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

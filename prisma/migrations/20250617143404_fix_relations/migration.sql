/*
  Warnings:

  - Added the required column `name` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `diagnosis` ADD COLUMN `name` VARCHAR(191) NOT NULL;

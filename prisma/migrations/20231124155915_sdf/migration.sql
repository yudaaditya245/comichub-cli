/*
  Warnings:

  - You are about to alter the column `updated_at` on the `comics` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `comics` MODIFY `updated_at` DATETIME NOT NULL;

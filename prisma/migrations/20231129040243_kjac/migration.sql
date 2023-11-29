/*
  Warnings:

  - You are about to alter the column `updated_at` on the `comics` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `comics` ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0,
    MODIFY `updated_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `scraps` MODIFY `updated_at` DATETIME NOT NULL;

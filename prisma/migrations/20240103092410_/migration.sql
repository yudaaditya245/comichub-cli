/*
  Warnings:

  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `error_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `ScrapChapters` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `Comics` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL,
    MODIFY `error_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `ScrapChapters` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

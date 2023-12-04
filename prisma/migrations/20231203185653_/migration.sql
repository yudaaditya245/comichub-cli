/*
  Warnings:

  - You are about to alter the column `updated_at` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- AlterTable
ALTER TABLE `groups` MODIFY `updated_at` TIMESTAMP NOT NULL,
    MODIFY `icon` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;
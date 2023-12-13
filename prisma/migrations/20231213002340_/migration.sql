/*
  Warnings:

  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `updated_at` to the `Comics_Lang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Comics_Lang` ADD COLUMN `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

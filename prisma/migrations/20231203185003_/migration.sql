/*
  Warnings:

  - You are about to alter the column `updated_at` on the `groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - A unique constraint covering the columns `[slug]` on the table `Groups` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `groups` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Groups_slug_key` ON `Groups`(`slug`);

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_source_fkey` FOREIGN KEY (`source`) REFERENCES `Groups`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

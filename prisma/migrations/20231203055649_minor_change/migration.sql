/*
  Warnings:

  - You are about to drop the column `mainId` on the `scraps` table. All the data in the column will be lost.
  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropForeignKey
ALTER TABLE `scraps` DROP FOREIGN KEY `Scraps_mainId_fkey`;

-- AlterTable
ALTER TABLE `scraps` DROP COLUMN `mainId`,
    ADD COLUMN `main_id` INTEGER NULL,
    MODIFY `updated_at` DATETIME NOT NULL;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_main_id_fkey` FOREIGN KEY (`main_id`) REFERENCES `Comics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

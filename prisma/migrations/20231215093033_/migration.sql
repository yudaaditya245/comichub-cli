/*
  Warnings:

  - You are about to alter the column `updated_at` on the `ComicsLang` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `error_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `ComicsLang` DROP FOREIGN KEY `ComicsLang_comic_id_fkey`;

-- DropForeignKey
ALTER TABLE `ComicsLang` DROP FOREIGN KEY `ComicsLang_scrap_id_fkey`;

-- AlterTable
ALTER TABLE `ComicsLang` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL,
    MODIFY `error_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_comic_id_fkey` FOREIGN KEY (`comic_id`) REFERENCES `Comics`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `Scraps`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `Comics_Lang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Comics_Lang` DROP FOREIGN KEY `Comics_Lang_comic_id_fkey`;

-- DropForeignKey
ALTER TABLE `Comics_Lang` DROP FOREIGN KEY `Comics_Lang_scrap_id_fkey`;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE `Comics_Lang`;

-- CreateTable
CREATE TABLE `ComicsLang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang` VARCHAR(255) NOT NULL,
    `comic_id` INTEGER NOT NULL,
    `scrap_id` INTEGER NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,

    UNIQUE INDEX `ComicsLang_scrap_id_key`(`scrap_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_comic_id_fkey` FOREIGN KEY (`comic_id`) REFERENCES `Comics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `Scraps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

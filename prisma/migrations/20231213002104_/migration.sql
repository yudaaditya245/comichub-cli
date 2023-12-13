/*
  Warnings:

  - You are about to drop the column `latest_chapter` on the `Comics` table. All the data in the column will be lost.
  - You are about to drop the column `latest_scrap_id` on the `Comics` table. All the data in the column will be lost.
  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.

*/
-- DropForeignKey
ALTER TABLE `Comics` DROP FOREIGN KEY `Comics_latest_scrap_id_fkey`;

-- AlterTable
ALTER TABLE `Comics` DROP COLUMN `latest_chapter`,
    DROP COLUMN `latest_scrap_id`;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- CreateTable
CREATE TABLE `Comics_Lang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang` VARCHAR(255) NOT NULL,
    `comic_id` INTEGER NOT NULL,
    `scrap_id` INTEGER NOT NULL,

    UNIQUE INDEX `Comics_Lang_scrap_id_key`(`scrap_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comics_Lang` ADD CONSTRAINT `Comics_Lang_comic_id_fkey` FOREIGN KEY (`comic_id`) REFERENCES `Comics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comics_Lang` ADD CONSTRAINT `Comics_Lang_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `Scraps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

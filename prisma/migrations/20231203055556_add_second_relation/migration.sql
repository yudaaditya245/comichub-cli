/*
  Warnings:

  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[latest_scrap_id]` on the table `Comics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latest_chapter` to the `Comics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latest_scrap_id` to the `Comics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comics` ADD COLUMN `latest_chapter` INTEGER NOT NULL,
    ADD COLUMN `latest_scrap_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `scraps` MODIFY `updated_at` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Comics_latest_scrap_id_key` ON `Comics`(`latest_scrap_id`);

-- AddForeignKey
ALTER TABLE `Comics` ADD CONSTRAINT `Comics_latest_scrap_id_fkey` FOREIGN KEY (`latest_scrap_id`) REFERENCES `Scraps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

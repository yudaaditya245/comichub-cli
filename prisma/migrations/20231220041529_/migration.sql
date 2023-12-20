/*
  Warnings:

  - You are about to alter the column `updated_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `error_at` on the `Groups` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `Scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `ComicsLang` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ComicsLang` DROP FOREIGN KEY `ComicsLang_comic_id_fkey`;

-- DropForeignKey
ALTER TABLE `ComicsLang` DROP FOREIGN KEY `ComicsLang_scrap_id_fkey`;

-- AlterTable
ALTER TABLE `Groups` MODIFY `updated_at` TIMESTAMP NOT NULL,
    MODIFY `error_at` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `Scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE `ComicsLang`;

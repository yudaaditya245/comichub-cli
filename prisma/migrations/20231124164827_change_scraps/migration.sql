/*
  Warnings:

  - You are about to drop the `comics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `comics`;

-- CreateTable
CREATE TABLE `Scraps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `latest_chapter` INTEGER NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `img` VARCHAR(255) NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

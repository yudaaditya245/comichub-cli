-- CreateTable
CREATE TABLE `Comics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `latest_chapter` INTEGER NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `img` VARCHAR(255) NOT NULL,
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

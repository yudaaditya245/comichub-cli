-- CreateTable
CREATE TABLE `Comics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `synonyms` TEXT NULL,
    `description` TEXT NOT NULL,
    `cover_img` VARCHAR(255) NOT NULL,
    `genres` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NOT NULL,
    `score` INTEGER NULL DEFAULT 0,
    `anilist_url` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scraps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `mainId` INTEGER NULL,
    `latest_chapter` INTEGER NOT NULL,
    `link_chapter` VARCHAR(255) NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `cover_img` VARCHAR(255) NOT NULL,
    `images` TEXT NULL,
    `updated_at` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_mainId_fkey` FOREIGN KEY (`mainId`) REFERENCES `Comics`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

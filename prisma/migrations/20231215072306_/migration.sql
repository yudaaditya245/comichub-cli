-- CreateTable
CREATE TABLE `Comics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `cover_img` VARCHAR(255) NOT NULL,
    `synonyms` TEXT NULL,
    `description` TEXT NOT NULL,
    `genres` VARCHAR(255) NOT NULL,
    `score` INTEGER NULL DEFAULT 0,
    `type` VARCHAR(255) NOT NULL,
    `anilist_url` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComicsLang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang` VARCHAR(255) NOT NULL,
    `comic_id` INTEGER NOT NULL,
    `scrap_id` INTEGER NOT NULL,
    `latest_chapter` INTEGER NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,

    UNIQUE INDEX `ComicsLang_scrap_id_key`(`scrap_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scraps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `main_id` INTEGER NULL,
    `latest_chapter` INTEGER NOT NULL,
    `lang` VARCHAR(255) NOT NULL,
    `link_chapter` VARCHAR(255) NOT NULL,
    `source` VARCHAR(255) NOT NULL,
    `link` VARCHAR(255) NOT NULL,
    `cover_img` VARCHAR(255) NOT NULL,
    `images` TEXT NULL,
    `updated_at` TIMESTAMP NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NULL,

    UNIQUE INDEX `Groups_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_comic_id_fkey` FOREIGN KEY (`comic_id`) REFERENCES `Comics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComicsLang` ADD CONSTRAINT `ComicsLang_scrap_id_fkey` FOREIGN KEY (`scrap_id`) REFERENCES `Scraps`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_main_id_fkey` FOREIGN KEY (`main_id`) REFERENCES `Comics`(`id`) ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `Scraps` ADD CONSTRAINT `Scraps_source_fkey` FOREIGN KEY (`source`) REFERENCES `Groups`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

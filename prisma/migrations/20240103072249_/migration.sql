-- CreateTable
CREATE TABLE "Comics" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "cover_img" VARCHAR(255) NOT NULL,
    "synonyms" TEXT,
    "description" TEXT NOT NULL,
    "genres" VARCHAR(255) NOT NULL,
    "score" INTEGER DEFAULT 0,
    "type" VARCHAR(255) NOT NULL,
    "anilist_url" VARCHAR(255) NOT NULL,

    CONSTRAINT "Comics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scraps" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "main_id" INTEGER,
    "latest_chapter" INTEGER NOT NULL,
    "lang" VARCHAR(255) NOT NULL,
    "link_chapter" VARCHAR(255) NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "cover_img" VARCHAR(255) NOT NULL,
    "images" TEXT,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "Scraps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapChapters" (
    "id" SERIAL NOT NULL,
    "scrap_id" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "images" TEXT,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "ScrapChapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groups" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "error_at" TIMESTAMP,
    "error_message" TEXT,
    "link" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Groups_slug_key" ON "Groups"("slug");

-- AddForeignKey
ALTER TABLE "Scraps" ADD CONSTRAINT "Scraps_main_id_fkey" FOREIGN KEY ("main_id") REFERENCES "Comics"("id") ON DELETE SET NULL ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE "Scraps" ADD CONSTRAINT "Scraps_source_fkey" FOREIGN KEY ("source") REFERENCES "Groups"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapChapters" ADD CONSTRAINT "ScrapChapters_scrap_id_fkey" FOREIGN KEY ("scrap_id") REFERENCES "Scraps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

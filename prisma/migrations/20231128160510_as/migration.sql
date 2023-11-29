/*
  Warnings:

  - You are about to drop the column `genre` on the `comics` table. All the data in the column will be lost.
  - You are about to alter the column `updated_at` on the `comics` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updated_at` on the `scraps` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - Added the required column `genres` to the `Comics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comics` DROP COLUMN `genre`,
    ADD COLUMN `genres` VARCHAR(255) NOT NULL,
    MODIFY `updated_at` TIMESTAMP NOT NULL;

-- AlterTable
ALTER TABLE `scraps` MODIFY `updated_at` TIMESTAMP NOT NULL;

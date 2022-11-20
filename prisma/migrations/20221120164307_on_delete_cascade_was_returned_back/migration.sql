/*
  Warnings:

  - The primary key for the `collectionuser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `CollectionUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `collectionuser` DROP FOREIGN KEY `CollectionUser_collectionId_fkey`;

-- AlterTable
ALTER TABLE `collectionuser` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `CollectionUser` ADD CONSTRAINT `CollectionUser_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - The primary key for the `collectionuser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `collectionuser` table. All the data in the column will be lost.
  - Added the required column `latestEntry` to the `Collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `collectionuser` DROP FOREIGN KEY `CollectionUser_collectionId_fkey`;

-- AlterTable
ALTER TABLE `collection` ADD COLUMN `latestEntry` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `collectionuser` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`collectionId`, `userId`);

-- AddForeignKey
ALTER TABLE `CollectionUser` ADD CONSTRAINT `CollectionUser_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE `collectionuser` DROP FOREIGN KEY `CollectionUser_collectionId_fkey`;

-- AddForeignKey
ALTER TABLE `CollectionUser` ADD CONSTRAINT `CollectionUser_collectionId_fkey` FOREIGN KEY (`collectionId`) REFERENCES `Collection`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

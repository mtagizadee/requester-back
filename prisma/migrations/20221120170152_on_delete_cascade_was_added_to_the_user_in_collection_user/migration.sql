-- DropForeignKey
ALTER TABLE `collectionuser` DROP FOREIGN KEY `CollectionUser_userId_fkey`;

-- AddForeignKey
ALTER TABLE `CollectionUser` ADD CONSTRAINT `CollectionUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

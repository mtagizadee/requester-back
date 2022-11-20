/*
  Warnings:

  - You are about to drop the column `createdAt` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `request` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `collection` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `folder` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `request` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

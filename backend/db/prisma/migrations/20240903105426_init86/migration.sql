/*
  Warnings:

  - You are about to drop the `Documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Favarate` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Documents` DROP FOREIGN KEY `Documents_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Favarate` DROP FOREIGN KEY `Favarate_userId_fkey`;

-- AlterTable
ALTER TABLE `Address` ADD COLUMN `date` VARCHAR(191) NOT NULL,
    ADD COLUMN `documents` JSON NULL;

-- DropTable
DROP TABLE `Documents`;

-- DropTable
DROP TABLE `Favarate`;

-- CreateTable
CREATE TABLE `Interests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `interest` JSON NOT NULL,
    `date` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Interests` ADD CONSTRAINT `Interests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

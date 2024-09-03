/*
  Warnings:

  - You are about to drop the column `interest` on the `Interests` table. All the data in the column will be lost.
  - Added the required column `value` to the `Interests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Interests` DROP COLUMN `interest`,
    ADD COLUMN `value` VARCHAR(191) NOT NULL;

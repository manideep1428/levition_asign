/*
  Warnings:

  - You are about to alter the column `Interests` on the `Favarate` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Favarate` MODIFY `Interests` JSON NOT NULL;

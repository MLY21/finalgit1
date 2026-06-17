/*
  Warnings:

  - You are about to drop the `_managedclients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_managedclients` DROP FOREIGN KEY `_ManagedClients_A_fkey`;

-- DropForeignKey
ALTER TABLE `_managedclients` DROP FOREIGN KEY `_ManagedClients_B_fkey`;

-- AlterTable
ALTER TABLE `client` ADD COLUMN `adminId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_managedclients`;

-- CreateIndex
CREATE INDEX `Client_adminId_idx` ON `Client`(`adminId`);

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

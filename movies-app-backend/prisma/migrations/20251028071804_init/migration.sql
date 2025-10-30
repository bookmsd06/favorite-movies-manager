/*
  Warnings:

  - Made the column `director` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budget` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `duration` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year_time` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `movies` MODIFY `director` VARCHAR(191) NOT NULL,
    MODIFY `budget` DOUBLE NOT NULL,
    MODIFY `location` VARCHAR(191) NOT NULL,
    MODIFY `duration` INTEGER NOT NULL,
    MODIFY `year_time` INTEGER NOT NULL;

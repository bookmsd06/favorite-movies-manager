-- CreateTable
CREATE TABLE `Movies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('MOVIE', 'TV_SHOW') NOT NULL,
    `director` VARCHAR(191) NULL,
    `budget` DOUBLE NULL,
    `location` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `year_time` INTEGER NULL,
    `details` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Movies_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

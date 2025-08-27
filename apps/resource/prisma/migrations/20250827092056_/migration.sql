-- AlterTable
ALTER TABLE `Feed` ADD COLUMN `item_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Feed` ADD CONSTRAINT `Feed_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

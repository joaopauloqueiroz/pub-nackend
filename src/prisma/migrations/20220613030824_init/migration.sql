/*
  Warnings:

  - You are about to drop the column `productsId` on the `OrderItems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_productsId_fkey";

-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "productsId",
ADD COLUMN     "productId" TEXT;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

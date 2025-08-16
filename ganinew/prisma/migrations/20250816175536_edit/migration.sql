/*
  Warnings:

  - You are about to drop the column `like` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "like",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

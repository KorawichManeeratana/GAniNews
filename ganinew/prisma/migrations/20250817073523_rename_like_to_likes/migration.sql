/*
  Warnings:

  - You are about to drop the column `like` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `likes` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "like",
ADD COLUMN     "likes" INTEGER NOT NULL;

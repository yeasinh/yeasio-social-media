/*
  Warnings:

  - You are about to drop the column `initiatorId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `isSeen` on the `Message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[participantAId,participantBId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participantAId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantBId` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_initiatorId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_recipientId_fkey";

-- DropIndex
DROP INDEX "Conversation_initiatorId_recipientId_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "initiatorId",
DROP COLUMN "recipientId",
ADD COLUMN     "participantAId" TEXT NOT NULL,
ADD COLUMN     "participantBId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isSeen",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participantAId_participantBId_key" ON "Conversation"("participantAId", "participantBId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participantAId_fkey" FOREIGN KEY ("participantAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participantBId_fkey" FOREIGN KEY ("participantBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

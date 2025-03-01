/*
  Warnings:

  - The primary key for the `conversations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `conversations` table. All the data in the column will be lost.
  - You are about to drop the column `conversationId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[threadId]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `threadId` to the `conversations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threadId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- AlterTable
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_pkey",
DROP COLUMN "id",
ADD COLUMN     "threadId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversationId",
ADD COLUMN     "threadId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_threadId_key" ON "conversations"("threadId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "conversations"("threadId") ON DELETE RESTRICT ON UPDATE CASCADE;

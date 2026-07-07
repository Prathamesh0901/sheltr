/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Recording` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sheltrSessionId]` on the table `Recording` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sheltrSessionId` to the `Recording` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recording" DROP COLUMN "sessionId",
ADD COLUMN     "sheltrSessionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SheltrSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "SheltrSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recording_sheltrSessionId_key" ON "Recording"("sheltrSessionId");

-- AddForeignKey
ALTER TABLE "SheltrSession" ADD CONSTRAINT "SheltrSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recording" ADD CONSTRAINT "Recording_sheltrSessionId_fkey" FOREIGN KEY ("sheltrSessionId") REFERENCES "SheltrSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

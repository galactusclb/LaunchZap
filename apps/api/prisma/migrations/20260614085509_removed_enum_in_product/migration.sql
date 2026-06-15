/*
  Warnings:

  - You are about to drop the column `launchDate` on the `products` table. All the data in the column will be lost.
  - The `status` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "launchDate",
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "ProductStatus";

-- DropEnum
DROP TYPE "Roles";

-- CreateTable
CREATE TABLE "launches" (
    "id" TEXT NOT NULL,
    "tagline" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "gallery" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "launchDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "launches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "launch_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "launchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "launch_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "launch_votes_userId_launchId_key" ON "launch_votes"("userId", "launchId");

-- AddForeignKey
ALTER TABLE "launches" ADD CONSTRAINT "launches_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_votes" ADD CONSTRAINT "launch_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "launch_votes" ADD CONSTRAINT "launch_votes_launchId_fkey" FOREIGN KEY ("launchId") REFERENCES "launches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

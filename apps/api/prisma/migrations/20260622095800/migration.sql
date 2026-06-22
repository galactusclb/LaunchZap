/*
  Warnings:

  - Made the column `launchDate` on table `launches` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "launches" ALTER COLUMN "status" SET DEFAULT 'DRAFT',
ALTER COLUMN "launchDate" SET NOT NULL,
ALTER COLUMN "launchDate" SET DEFAULT CURRENT_TIMESTAMP;

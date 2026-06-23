/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `launches` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `launches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "launches" ALTER COLUMN "launchDate" DROP DEFAULT;

ALTER TABLE "launches" ADD COLUMN     "slug" VARCHAR(100);

UPDATE "launches" SET "slug" = LOWER(REGEXP_REPLACE("tagline", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || id WHERE "slug" IS NULL;

ALTER TABLE "launches" ALTER COLUMN "slug" SET NOT NULL;


-- AlterTable
ALTER TABLE "products" ADD COLUMN     "slug" VARCHAR(100);

UPDATE "products" SET "slug" = LOWER(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g')) || '-' || id WHERE "slug" IS NULL;

ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;


-- CreateIndex
CREATE UNIQUE INDEX "launches_slug_key" ON "launches"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

import "dotenv/config";
import { PrismaClient } from "../src/lib/prisma/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedProducts } from "./seeds/seedProducts.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await seedProducts();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

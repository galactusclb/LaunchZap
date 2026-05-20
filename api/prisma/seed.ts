import "dotenv/config";
import { seedProducts } from "./seeds/seedProducts.js";

import prisma from "../src/lib/prisma/prisma.js";

async function main() {
  await seedProducts(prisma);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

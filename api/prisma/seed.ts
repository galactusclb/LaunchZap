import prisma from '../src/utils/prisma';

import { seedProducts } from './seeds/seedProducts';

async function main() {
  await seedProducts();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

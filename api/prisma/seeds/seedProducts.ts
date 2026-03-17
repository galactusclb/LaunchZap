import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function seedProducts() {
    await prisma.product.createMany({
        data: [
            {
                productName: 'HP laptop',
                productDescription: 'This is HP laptop'
            },
            {
                productName: 'lenovo laptop',
                productDescription: 'This is lenovo'
            },
            {
                productName: 'Car',
                productDescription: 'This is Car'
            },
            {
                productName: 'Bike',
                productDescription: 'This is Bike'
            }
        ]
    },
    );
    console.log('✅ Created sample products');
}

export { seedProducts };

import prisma from '../../src/utils/prisma';

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

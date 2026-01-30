import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // You can add seed data here if needed
    // For example:
    // await prisma.medicine.createMany({
    //   data: [
    //     { name: 'Medicine 1', content: '100mg', unit: 'viên' },
    //     { name: 'Medicine 2', content: '50mg', unit: 'viên' },
    //   ],
    // });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

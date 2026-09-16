import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const availableImages = [
  '/uploads/room-1.jpg',
  '/uploads/room-2.jpg',
  '/uploads/room-3.jpg',
  '/uploads/unique-room-1.jpg',
  '/uploads/unique-room-2.jpg',
  '/uploads/unique-room-3.jpg',
  '/uploads/unique-room-4.jpg',
  '/uploads/unique-room-5.jpg',
  '/uploads/1789301559052-288025067.jpg',
  '/uploads/1789301589400-497111282.jpg',
  '/uploads/1789384331991-514745558.jpg',
];

// Shuffle array
function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

async function main() {
  console.log('Seeding multiple images for all room categories...');

  const categories = await prisma.roomCategory.findMany();

  // First delete all existing images
  await prisma.image.deleteMany();

  for (const category of categories) {
    // Pick 5 to 6 images randomly
    const numImages = Math.floor(Math.random() * 2) + 5; 
    const shuffledImages = shuffle([...availableImages]).slice(0, numImages);

    for (const url of shuffledImages) {
      await prisma.image.create({
        data: {
          url,
          categoryId: category.id,
        }
      });
    }
  }

  console.log('Images seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

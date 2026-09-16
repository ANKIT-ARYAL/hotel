import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const images = await prisma.image.findMany();
  let counter = 1;
  for (const img of images) {
    if (img.url.includes('unsplash.com')) {
      await prisma.image.update({
        where: { id: img.id },
        data: { url: `/uploads/room-${counter}.jpg` }
      });
      counter = counter === 3 ? 1 : counter + 1;
    }
  }
  console.log('Images fixed to point to local uploads bucket!');
}
main();

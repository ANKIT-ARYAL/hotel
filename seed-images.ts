import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.roomCategory.findFirst({ where: { slug: 'standard-room' } });
  if (!category) return console.log('No standard-room category found');
  
  const urls = [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80'
  ];
  
  for (const url of urls) {
    await prisma.image.create({
      data: {
        url,
        categoryId: category.id
      }
    });
  }
  console.log('Images added!');
}
main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding production descriptions for categories and rooms...');

  // Update Categories
  const standardRoom = await prisma.roomCategory.findUnique({ where: { slug: 'standard-room' } });
  if (standardRoom) {
    await prisma.roomCategory.update({
      where: { id: standardRoom.id },
      data: {
        description: `Experience the perfect blend of modern comfort and timeless elegance in our Standard Room. Designed with the discerning traveler in mind, this sanctuary offers a peaceful retreat from the bustling city. The space is thoughtfully appointed with bespoke furnishings, a plush king-sized bed wrapped in high-thread-count Egyptian cotton linens, and ambient lighting that creates a warm, inviting atmosphere. 
        
The en-suite bathroom features a rainfall shower and premium organic bath amenities, ensuring your daily routines feel like a spa experience. Whether you're visiting for business or leisure, the Standard Room provides all the essential luxuries, including high-speed Wi-Fi, a state-of-the-art smart TV, and a dedicated workspace. Discover a haven where every detail has been curated to guarantee an exceptional stay.`
      }
    });
  }

  const deluxeSuite = await prisma.roomCategory.findUnique({ where: { slug: 'deluxe-suite' } });
  if (deluxeSuite) {
    await prisma.roomCategory.update({
      where: { id: deluxeSuite.id },
      data: {
        description: `Elevate your stay in our magnificent Deluxe Suite, a sprawling oasis of luxury that redefines premium accommodation. This expansive suite seamlessly integrates a lavishly designed bedroom with a separate, exquisitely furnished living area, making it perfect for extended stays or entertaining guests. Floor-to-ceiling windows bathe the room in natural light while offering spectacular panoramic views of the surrounding landscape.

Every element of the Deluxe Suite speaks to unparalleled refinement. Relax on the oversized velvet sofa, enjoy the curated minibar featuring artisanal local selections, or unwind in the deep-soaking marble bathtub. Exclusive suite privileges include personalized concierge service, priority restaurant reservations, and complimentary evening turndown service, ensuring your experience is nothing short of extraordinary.`
      }
    });
  }

  const presidentialSuite = await prisma.roomCategory.findUnique({ where: { slug: 'presidential-suite' } });
  if (presidentialSuite) {
    await prisma.roomCategory.update({
      where: { id: presidentialSuite.id },
      data: {
        description: `The pinnacle of opulence awaits in the Presidential Suite, our most exclusive and breathtaking accommodation. Spanning an entire wing of the top floor, this majestic residence is a masterclass in architectural brilliance and interior design. It features a grand foyer, a formal dining room seating ten, a private library, and a sweeping terrace that provides unrivaled, unobstructed views of the city skyline and ocean beyond.

The master bedroom is a sanctuary of indulgence, boasting a custom-crafted bed, an expansive walk-in wardrobe, and a palatial en-suite bathroom clad in rare Italian marble with a central jacuzzi. Guests of the Presidential Suite enjoy the ultimate in personalized service, including a dedicated 24-hour butler, private check-in, exclusive access to our hidden VIP lounge, and complimentary private chauffeur service. This is not merely a room; it is an unforgettable, royal experience.`
      }
    });
  }

  // Update Individual Rooms
  const rooms = await prisma.room.findMany();
  for (const room of rooms) {
    let customDescription = '';
    const roomNum = parseInt(room.number);

    if (roomNum % 3 === 0) {
      customDescription = `Room ${room.number} offers a uniquely positioned vantage point, capturing stunning morning light that perfectly illuminates the carefully curated artwork adorning the walls. Enjoy the whisper-quiet ambiance and unparalleled privacy this specific unit affords.`;
    } else if (roomNum % 3 === 1) {
      customDescription = `Distinguished by its slightly expanded floor plan, Room ${room.number} provides extra lounging space and features an exclusive reading nook by the window. The subtle, bespoke interior accents make this particular room a favorite among our returning guests.`;
    } else {
      customDescription = `Experience the pristine comfort of Room ${room.number}, located in a highly sought-after, tranquil corridor of the hotel. This room features customized acoustic insulation and an incredibly serene atmosphere, guaranteeing the most restful night's sleep imaginable.`;
    }

    await prisma.room.update({
      where: { id: room.id },
      data: { description: customDescription }
    });
  }

  console.log('Production data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

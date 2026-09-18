import { PrismaClient } from '@prisma/client';
import { DiningPageSettings, defaultDiningPageSettings } from '../src/components/dining/types';

const prisma = new PrismaClient();

async function main() {
  const SETTINGS_KEY = 'DINING_PAGE_SETTINGS';
  
  const setting = await prisma.setting.findUnique({
    where: { key: SETTINGS_KEY },
  });

  let settings: DiningPageSettings = defaultDiningPageSettings;

  if (setting) {
    try {
      const parsed = JSON.parse(setting.value);
      settings = {
        hero: { ...defaultDiningPageSettings.hero, ...parsed.hero },
        intro: { ...defaultDiningPageSettings.intro, ...parsed.intro },
        restaurantsList: {
          ...defaultDiningPageSettings.restaurantsList,
          ...parsed.restaurantsList,
          venues: parsed.restaurantsList?.venues || [],
        },
        philosophy: { ...defaultDiningPageSettings.philosophy, ...parsed.philosophy },
        menus: { ...defaultDiningPageSettings.menus, ...parsed.menus },
        events: { ...defaultDiningPageSettings.events, ...parsed.events },
        bar: { ...defaultDiningPageSettings.bar, ...parsed.bar },
        liveMusic: { ...defaultDiningPageSettings.liveMusic, ...parsed.liveMusic },
        privateDining: { ...defaultDiningPageSettings.privateDining, ...parsed.privateDining },
      };
    } catch (e) {}
  }

  // Update Bar images
  settings.bar.images = [
    { id: 'b1', url: '/uploads/bar_interior_1789632964846.jpg' },
    { id: 'b2', url: '/uploads/cocktail_closeup_1789632977279.jpg' },
    { id: 'b3', url: '/uploads/exterior.jpg' },
  ];

  // Update Events images
  settings.events.images = [
    { id: 'e1', url: '/uploads/events_wine_tasting_1789633002418.jpg' },
    { id: 'e2', url: '/uploads/unique-room-1.jpg' },
    { id: 'e3', url: '/uploads/unique-room-2.jpg' },
  ];

  // Update Live Music images
  settings.liveMusic.images = [
    { id: 'lm1', url: '/uploads/room-1.jpg' },
    { id: 'lm2', url: '/uploads/room-2.jpg' },
    { id: 'lm3', url: '/uploads/room-3.jpg' },
  ];

  // Update Private Dining images
  settings.privateDining.images = [
    { id: 'pd1', url: '/uploads/unique-room-3.jpg' },
    { id: 'pd2', url: '/uploads/unique-room-4.jpg' },
    { id: 'pd3', url: '/uploads/unique-room-5.jpg' },
  ];

  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: JSON.stringify(settings) },
    create: { key: SETTINGS_KEY, value: JSON.stringify(settings) },
  });

  console.log('Successfully updated dining page images!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

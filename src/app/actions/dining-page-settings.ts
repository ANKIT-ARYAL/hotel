'use server';

import prisma from '@/lib/db';
import { DiningPageSettings, defaultDiningPageSettings } from '@/components/dining/types';

const SETTINGS_KEY = 'DINING_PAGE_SETTINGS';

export async function getDiningPageSettings(): Promise<DiningPageSettings> {
  const setting = await prisma.setting.findUnique({
    where: { key: SETTINGS_KEY },
  });

  if (!setting) {
    return defaultDiningPageSettings;
  }

  try {
    const parsed = JSON.parse(setting.value);
    return {
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
    };
  } catch (error) {
    console.error('Failed to parse dining page settings:', error);
    return defaultDiningPageSettings;
  }
}

export async function updateDiningPageSettings(settings: DiningPageSettings) {
  const value = JSON.stringify(settings);
  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value },
    create: { key: SETTINGS_KEY, value },
  });
}

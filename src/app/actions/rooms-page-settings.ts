'use server';

import prisma from '@/lib/db';
import { RoomsPageSettings, defaultRoomsPageSettings } from '@/components/rooms/types';
import { revalidatePath } from 'next/cache';

export async function getRoomsPageSettings(): Promise<RoomsPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'rooms_page_settings' },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultRoomsPageSettings,
        ...parsed,
        hero: { ...defaultRoomsPageSettings.hero, ...parsed.hero },
        listSection: { ...defaultRoomsPageSettings.listSection, ...parsed.listSection },
        detailsHero: { ...defaultRoomsPageSettings.detailsHero, ...parsed.detailsHero },
        amenitiesSection: { ...defaultRoomsPageSettings.amenitiesSection, ...parsed.amenitiesSection },
        bookingCta: { ...defaultRoomsPageSettings.bookingCta, ...parsed.bookingCta },
      } as RoomsPageSettings;
    }

    // Seed defaults if missing
    await prisma.setting.upsert({
      where: { key: 'rooms_page_settings' },
      update: {},
      create: {
        key: 'rooms_page_settings',
        value: JSON.stringify(defaultRoomsPageSettings),
      },
    });

    return defaultRoomsPageSettings;
  } catch (error) {
    console.error('Error fetching rooms page settings:', error);
    return defaultRoomsPageSettings;
  }
}

export async function updateRoomsPageSettings(settings: RoomsPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: 'rooms_page_settings' },
      update: {
        value: JSON.stringify(settings),
      },
      create: {
        key: 'rooms_page_settings',
        value: JSON.stringify(settings),
      },
    });

    revalidatePath('/rooms-and-suites');
    revalidatePath('/rooms-and-suites/[slug]', 'page');
    revalidatePath('/admin/pages/rooms');
    return { success: true };
  } catch (error) {
    console.error('Error updating rooms page settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

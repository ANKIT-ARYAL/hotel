'use server';

import prisma from '@/lib/db';
import { HomepageSettings, defaultHomepageSettings } from '@/components/homepage/types';
import { revalidatePath } from 'next/cache';

export async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'homepage_settings' },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultHomepageSettings,
        ...parsed,
        experiences: parsed.experiences || defaultHomepageSettings.experiences,
        ourStory: parsed.ourStory || defaultHomepageSettings.ourStory,
        bookingCta: parsed.bookingCta || defaultHomepageSettings.bookingCta,
      } as HomepageSettings;
    }

    // Seed defaults if missing
    await prisma.setting.upsert({
      where: { key: 'homepage_settings' },
      update: {},
      create: {
        key: 'homepage_settings',
        value: JSON.stringify(defaultHomepageSettings),
      },
    });

    return defaultHomepageSettings;
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return defaultHomepageSettings;
  }
}

export async function updateHomepageSettings(settings: HomepageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: 'homepage_settings' },
      update: {
        value: JSON.stringify(settings),
      },
      create: {
        key: 'homepage_settings',
        value: JSON.stringify(settings),
      },
    });

    revalidatePath('/');
    revalidatePath('/admin/pages/homepage');
    return { success: true };
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

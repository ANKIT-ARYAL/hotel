import React from 'react';
import { getHomepageSettings } from '@/app/actions/homepage-settings';
import { HomepageEditor } from './HomepageEditor';

export default async function HomepageAdminPage() {
  const settings = await getHomepageSettings();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Homepage Editor</h1>
        <p className="text-gray-500 mt-2">Manage the content, visibility, and layout of the public homepage.</p>
      </div>

      <HomepageEditor initialSettings={settings} />
    </div>
  );
}

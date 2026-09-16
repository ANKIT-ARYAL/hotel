'use client'
import { toast } from 'sonner';

import React, { useState } from 'react';
import { RoomsPageSettings } from '@/components/rooms/types';
import { updateRoomsPageSettings } from '@/app/actions/rooms-page-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function RoomsEditor({ initialSettings }: { initialSettings: RoomsPageSettings }) {
  const [settings, setSettings] = useState<RoomsPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await updateRoomsPageSettings(settings);
    setIsSaving(false);
    toast.success('Changes saved!');
    router.refresh();
  };

  const toggleVisibility = (section: keyof RoomsPageSettings) => {
    if (settings[section] && 'isVisible' in settings[section]) {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          isVisible: !(prev[section] as any).isVisible
        }
      }));
    }
  };

  const updateSectionField = (section: keyof RoomsPageSettings, field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Listing Hero Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listing Hero Section</CardTitle>
            <CardDescription>Hero banner for the main Rooms & Suites listing page</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('hero')}
            className={settings.hero.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.hero.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.hero.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.hero.title} 
                onChange={(e) => updateSectionField('hero', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <RichTextEditor 
                value={settings.hero.subtitle} 
                onChange={(val) => updateSectionField('hero', 'subtitle', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image</label>
              <div className="flex flex-col space-y-3">
                {settings.hero.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.hero.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                      });
                      const data = await res.json();
                      if (data.success) {
                        updateSectionField('hero', 'image', data.url);
                      } else {
                        alert('Upload failed: ' + data.error);
                      }
                    } catch (err) {
                      alert('Upload failed');
                    }
                  }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Video URL</label>
              <div className="flex flex-col space-y-3">
                {settings.hero.videoUrl && (
                  <div className="relative w-full max-w-sm rounded-md overflow-hidden bg-black/10 border border-zinc-200 aspect-video">
                    <video src={settings.hero.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
                  </div>
                )}
                <Input 
                  type="file" 
                  accept="video/mp4,video/webm"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                      });
                      const data = await res.json();
                      if (data.success) {
                        updateSectionField('hero', 'videoUrl', data.url);
                      } else {
                        alert('Upload failed: ' + data.error);
                      }
                    } catch (err) {
                      alert('Upload failed');
                    }
                  }} 
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Details Hero Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Details Hero Section</CardTitle>
            <CardDescription>Hero background for the individual category and room pages</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Video URL</label>
            <div className="flex flex-col space-y-3">
              {settings.detailsHero.videoUrl && (
                <div className="relative w-full max-w-sm rounded-md overflow-hidden bg-black/10 border border-zinc-200 aspect-video">
                  <video src={settings.detailsHero.videoUrl} className="w-full h-full object-cover" muted loop playsInline />
                </div>
              )}
              <Input 
                type="file" 
                accept="video/mp4,video/webm"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.success) {
                      updateSectionField('detailsHero', 'videoUrl', data.url);
                    } else {
                      alert('Upload failed: ' + data.error);
                    }
                  } catch (err) {
                    alert('Upload failed');
                  }
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listing Rooms Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rooms List Intro</CardTitle>
            <CardDescription>Introductory text before the list of rooms</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('listSection')}
            className={settings.listSection.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.listSection.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.listSection.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.listSection.title} 
                onChange={(e) => updateSectionField('listSection', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.listSection.description} 
                onChange={(val) => updateSectionField('listSection', 'description', val)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Details Amenities Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Amenities Header (Details Page)</CardTitle>
            <CardDescription>Header text for the amenities section inside a room's detail page</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('amenitiesSection')}
            className={settings.amenitiesSection.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.amenitiesSection.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.amenitiesSection.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.amenitiesSection.title} 
                onChange={(e) => updateSectionField('amenitiesSection', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <RichTextEditor 
                value={settings.amenitiesSection.subtitle} 
                onChange={(val) => updateSectionField('amenitiesSection', 'subtitle', val)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Booking CTA Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Booking CTA (Details Page)</CardTitle>
            <CardDescription>Call to action banner at the bottom of the room details page</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('bookingCta')}
            className={settings.bookingCta.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.bookingCta.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.bookingCta.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.bookingCta.title} 
                onChange={(e) => updateSectionField('bookingCta', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.bookingCta.description} 
                onChange={(val) => updateSectionField('bookingCta', 'description', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image</label>
              <div className="flex flex-col space-y-3">
                {settings.bookingCta.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.bookingCta.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.success) {
                        updateSectionField('bookingCta', 'image', data.url);
                      }
                    } catch (err) {}
                  }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input 
                value={settings.bookingCta.buttonLabel} 
                onChange={(e) => updateSectionField('bookingCta', 'buttonLabel', e.target.value)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-40">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2"/> Save Changes</>}
        </Button>
      </div>

    </div>
  );
}

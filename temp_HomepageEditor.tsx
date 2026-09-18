'use client'
import { toast } from 'sonner';

import React, { useState } from 'react';
import { HomepageSettings } from '@/components/homepage/types';
import { updateHomepageSettings } from '@/app/actions/homepage-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HomepageEditor({ initialSettings }: { initialSettings: HomepageSettings }) {
  const [settings, setSettings] = useState<HomepageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await updateHomepageSettings(settings);
    setIsSaving(false);
    toast.success('Changes saved!');
    router.refresh();
  };

  const toggleVisibility = (section: keyof HomepageSettings) => {
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

  const updateSectionField = (section: keyof HomepageSettings, field: string, value: string) => {
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
      
      {/* Hero Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main video and welcome text</CardDescription>
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
              <label className="text-sm font-medium">Video (MP4)</label>
              <div className="flex flex-col space-y-3">
                {settings.hero.videoUrl && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <video src={settings.hero.videoUrl} className="w-full h-full object-cover" muted playsInline />
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
                      // We can set a temporary loading state here if we wanted
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input 
                value={settings.hero.buttonLabel} 
                onChange={(e) => updateSectionField('hero', 'buttonLabel', e.target.value)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search Hero Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Search Page Hero Section</CardTitle>
            <CardDescription>Video background for the search results page</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('searchHero')}
            className={settings.searchHero?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.searchHero?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.searchHero?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video (MP4)</label>
              <div className="flex flex-col space-y-3">
                {settings.searchHero.videoUrl && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <video src={settings.searchHero.videoUrl} className="w-full h-full object-cover" muted playsInline />
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
                        updateSectionField('searchHero', 'videoUrl', data.url);
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

      {/* Culinary Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Culinary Section</CardTitle>
            <CardDescription>Fine dining promotion</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('culinary')}
            className={settings.culinary.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.culinary.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.culinary.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.culinary.title} 
                onChange={(e) => updateSectionField('culinary', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.culinary.description} 
                onChange={(val) => updateSectionField('culinary', 'description', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Upload</label>
              <div className="flex flex-col space-y-3">
                {settings.culinary.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.culinary.image} className="w-full h-full object-cover" alt="Preview" />
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
                        updateSectionField('culinary', 'image', data.url);
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

      {/* Spa Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Spa & Wellness Section</CardTitle>
            <CardDescription>Relaxation and treatments promotion</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('spaWellness')}
            className={settings.spaWellness.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.spaWellness.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.spaWellness.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.spaWellness.title} 
                onChange={(e) => updateSectionField('spaWellness', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.spaWellness.description} 
                onChange={(val) => updateSectionField('spaWellness', 'description', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Upload</label>
              <div className="flex flex-col space-y-3">
                {settings.spaWellness.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.spaWellness.image} className="w-full h-full object-cover" alt="Preview" />
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
                        updateSectionField('spaWellness', 'image', data.url);
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

      {/* Experiences Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Bespoke Experiences Section</CardTitle>
            <CardDescription>Curated activities promotion</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('experiences')}
            className={settings.experiences?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.experiences?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.experiences?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.experiences.title} 
                onChange={(e) => updateSectionField('experiences', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.experiences.description} 
                onChange={(val) => updateSectionField('experiences', 'description', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Upload</label>
              <div className="flex flex-col space-y-3">
                {settings.experiences.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.experiences.image} className="w-full h-full object-cover" alt="Preview" />
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
                        updateSectionField('experiences', 'image', data.url);
                      }
                    } catch (err) {}
                  }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input 
                value={settings.experiences.buttonLabel} 
                onChange={(e) => updateSectionField('experiences', 'buttonLabel', e.target.value)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      

      {/* Featured Accommodations Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Featured Accommodations</CardTitle>
            <CardDescription>Showcase your best rooms and suites</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('featuredRooms')}
            className={settings.featuredRooms?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.featuredRooms?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.featuredRooms?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.featuredRooms.title} 
                onChange={(e) => updateSectionField('featuredRooms', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.featuredRooms.description} 
                onChange={(val) => updateSectionField('featuredRooms', 'description', val)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: The individual rooms displayed here are managed from the Rooms Management tab.</p>
          </CardContent>
        )}
      </Card>

      {/* Amenities Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>World-Class Amenities</CardTitle>
            <CardDescription>Highlight your property's features</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('amenities')}
            className={settings.amenities?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.amenities?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.amenities?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.amenities.title} 
                onChange={(e) => updateSectionField('amenities', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.amenities.description} 
                onChange={(val) => updateSectionField('amenities', 'description', val)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: Specific amenity icons and details are managed from the Amenities Management tab.</p>
          </CardContent>
        )}
      </Card>

      {/* Testimonials Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Testimonials Section</CardTitle>
            <CardDescription>What our guests say</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('testimonials')}
            className={settings.testimonials?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.testimonials?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.testimonials?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.testimonials.title} 
                onChange={(e) => updateSectionField('testimonials', 'title', e.target.value)} 
              />
            </div>
            <p className="text-xs text-muted-foreground italic">Note: Reviews are managed from the Reviews Management tab.</p>
          </CardContent>
        )}
      </Card>

{/* Our Story Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Our Story Section</CardTitle>
            <CardDescription>Hotel history and legacy</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('ourStory')}
            className={settings.ourStory?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.ourStory?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.ourStory?.isVisible && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={settings.ourStory.title} 
                onChange={(e) => updateSectionField('ourStory', 'title', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor 
                value={settings.ourStory.description} 
                onChange={(val) => updateSectionField('ourStory', 'description', val)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Upload</label>
              <div className="flex flex-col space-y-3">
                {settings.ourStory.image && (
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={settings.ourStory.image} className="w-full h-full object-cover" alt="Preview" />
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
                        updateSectionField('ourStory', 'image', data.url);
                      }
                    } catch (err) {}
                  }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input 
                value={settings.ourStory.buttonLabel} 
                onChange={(e) => updateSectionField('ourStory', 'buttonLabel', e.target.value)} 
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Booking CTA Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Booking CTA Section</CardTitle>
            <CardDescription>Final call to action</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleVisibility('bookingCta')}
            className={settings.bookingCta?.isVisible ? "text-green-600" : "text-gray-400"}
          >
            {settings.bookingCta?.isVisible ? <><Eye className="w-4 h-4 mr-2"/> Visible</> : <><EyeOff className="w-4 h-4 mr-2"/> Hidden</>}
          </Button>
        </CardHeader>
        {settings.bookingCta?.isVisible && (
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
              <label className="text-sm font-medium">Image Upload</label>
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

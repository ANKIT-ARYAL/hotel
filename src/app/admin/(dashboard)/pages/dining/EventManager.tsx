'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, ChevronDown, ChevronUp, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { DiningEvent, EventsSection, TypographyOverrides } from '@/components/dining/types';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

interface EventManagerProps {
  events: DiningEvent[];
  onEventsChange: (events: DiningEvent[]) => void;
  typography?: TypographyOverrides;
  onTypographyChange?: (typography: TypographyOverrides) => void;
}

const EVENT_TYPES = [
  { value: 'live-music', label: 'Live Music' },
  { value: 'wine-dinner', label: 'Wine Dinner' },
  { value: 'private-dining', label: 'Private Dining' },
  { value: 'tasting', label: 'Tasting' },
  { value: 'other', label: 'Other' },
] as const;

export function EventManager({ 
  events, 
  onEventsChange, 
  typography = {},
  onTypographyChange 
}: EventManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DiningEvent>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<DiningEvent>>({
    title: '',
    date: '',
    time: '',
    description: '',
    image: '',
    type: 'other',
    capacity: '',
    ctaLabel: '',
    ctaUrl: '',
  });
  const [showTypography, setShowTypography] = useState(false);

  const handleUpload = async (file: File, onSuccess: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Error uploading file');
    }
  };

  const startEdit = (event: DiningEvent) => {
    setEditingId(event.id);
    setEditForm({ ...event });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = (event: DiningEvent) => {
    const updated = events.map(e => e.id === event.id ? { ...e, ...editForm } : e);
    onEventsChange(updated);
    setEditingId(null);
    setEditForm({});
    toast.success('Event updated');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, form: typeof editForm, setForm: typeof setEditForm) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId(editingId);
    handleUpload(file, (url) => {
      setForm({ ...form, image: url });
      setUploadingId(null);
    });
  };

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId('new');
    handleUpload(file, (url) => {
      setNewEvent({ ...newEvent, image: url });
      setUploadingId(null);
    });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast.error('Please fill in title, date, and time');
      return;
    }
    const event: DiningEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      description: newEvent.description || '',
      image: newEvent.image || '',
      type: newEvent.type || 'other',
      capacity: newEvent.capacity || '',
      ctaLabel: newEvent.ctaLabel || '',
      ctaUrl: newEvent.ctaUrl || '',
    };
    onEventsChange([...(events || []), event]);
    setNewEvent({ title: '', date: '', time: '', description: '', image: '', type: 'other', capacity: '', ctaLabel: '', ctaUrl: '' });
    setShowAddForm(false);
    toast.success('Event added');
  };

  const deleteEvent = (id: string) => {
    if (!confirm('Delete this event?')) return;
    onEventsChange((events || []).filter(e => e.id !== id));
    toast.success('Event deleted');
  };

  const moveEvent = (id: string, direction: 'up' | 'down') => {
    const index = events.findIndex(e => e.id === id);
    if (direction === 'up' && index > 0) {
      const newEvents = [...events];
      [newEvents[index], newEvents[index - 1]] = [newEvents[index - 1], newEvents[index]];
      onEventsChange(newEvents);
    } else if (direction === 'down' && index < events.length - 1) {
      const newEvents = [...events];
      [newEvents[index], newEvents[index + 1]] = [newEvents[index + 1], newEvents[index]];
      onEventsChange(newEvents);
    }
  };

  const handleTypographyChange = (key: keyof TypographyOverrides, value: string) => {
    if (!onTypographyChange) return;
    const newTypography = { ...typography, [key]: value || undefined };
    onTypographyChange(newTypography);
  };

  const formatEventType = (type: string) => {
    const found = EVENT_TYPES.find(t => t.value === type);
    return found?.label || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manage Events</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or remove dining events with images and rich descriptions</p>
        </div>
        {!showAddForm && editingId === null && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input 
                value={newEvent.title || ''} 
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="e.g., Jazz Night, Wine Pairing Dinner"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</label>
                <Input 
                  type="date"
                  value={newEvent.date || ''} 
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Time</label>
                <Input 
                  type="time"
                  value={newEvent.time || ''} 
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Type</label>
              <Select value={newEvent.type || 'other'} onValueChange={(value) => setNewEvent({ ...newEvent, type: value as DiningEvent['type'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor value={newEvent.description || ''} onChange={(value) => setNewEvent({ ...newEvent, description: value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> Event Image (Optional)</label>
              {newEvent.image && (
                <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                  <img src={newEvent.image} className="w-full h-full object-cover" />
                </div>
              )}
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleNewImageUpload}
                className="text-xs"
                disabled={uploadingId === 'new'}
              />
              {uploadingId === 'new' && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Capacity (Optional)</label>
                <Input 
                  value={newEvent.capacity || ''} 
                  onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  placeholder="e.g., 50 guests"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">CTA Label (Optional)</label>
                <Input 
                  value={newEvent.ctaLabel || ''} 
                  onChange={(e) => setNewEvent({ ...newEvent, ctaLabel: e.target.value })}
                  placeholder="e.g., Book Now, Learn More"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">CTA URL (Optional)</label>
              <Input 
                value={newEvent.ctaUrl || ''} 
                onChange={(e) => setNewEvent({ ...newEvent, ctaUrl: e.target.value })}
                placeholder="https://example.com/booking"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addEvent} disabled={uploadingId === 'new'}>Add Event</Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); setNewEvent({ title: '', date: '', time: '', description: '', image: '', type: 'other', capacity: '', ctaLabel: '', ctaUrl: '' }); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {events?.length === 0 && !showAddForm && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No events added yet. Click "Add Event" to create one.
            </CardContent>
          </Card>
        )}

        {events?.map((event) => (
          <Card key={event.id} className={editingId === event.id ? 'border-blue-200' : ''}>
            <CardContent className="space-y-4">
              {editingId === event.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Title</label>
                    <Input 
                      value={editForm.title || ''} 
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</label>
                      <Input 
                        type="date"
                        value={editForm.date || ''} 
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1"><Clock className="w-3 h-3"/> Time</label>
                      <Input 
                        type="time"
                        value={editForm.time || ''} 
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Type</label>
                    <Select value={editForm.type || 'other'} onValueChange={(value) => setEditForm({ ...editForm, type: value as DiningEvent['type'] })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <RichTextEditor value={editForm.description || ''} onChange={(value) => setEditForm({ ...editForm, description: value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> Event Image (Optional)</label>
                    {editForm.image && (
                      <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                        <img src={editForm.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, editForm, setEditForm)}
                      className="text-xs"
                      disabled={uploadingId === event.id}
                    />
                    {uploadingId === event.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Capacity (Optional)</label>
                      <Input 
                        value={editForm.capacity || ''} 
                        onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                        placeholder="e.g., 50 guests"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CTA Label (Optional)</label>
                      <Input 
                        value={editForm.ctaLabel || ''} 
                        onChange={(e) => setEditForm({ ...editForm, ctaLabel: e.target.value })}
                        placeholder="e.g., Book Now, Learn More"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CTA URL (Optional)</label>
                    <Input 
                      value={editForm.ctaUrl || ''} 
                      onChange={(e) => setEditForm({ ...editForm, ctaUrl: e.target.value })}
                      placeholder="https://example.com/booking"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveEdit(event)} disabled={uploadingId === event.id}>
                      {uploadingId === event.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded bg-zinc-100 overflow-hidden flex-shrink-0">
                        {event.image ? (
                          <img src={event.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {event.date} &nbsp;
                          <Clock className="w-3 h-3" /> {event.time}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-600 border border-zinc-200">
                          {formatEventType(event.type)}
                        </span>
                        {event.image && <p className="text-xs text-green-600">Image set</p>}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button variant="ghost" size="icon" onClick={() => moveEvent(event.id, 'up')} disabled={events.indexOf(event) === 0}>
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => moveEvent(event.id, 'down')} disabled={events.indexOf(event) === events.length - 1}>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(event)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {event.description && (
                    <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: event.description }} />
                    </div>
                  )}
                  
                  {(event.capacity || event.ctaLabel) && (
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {event.capacity && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200">
                          <span>Capacity: </span>
                          <span className="font-medium">{event.capacity}</span>
                        </span>
                      )}
                      {event.ctaLabel && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                          CTA: {event.ctaLabel} {event.ctaUrl && `(${event.ctaUrl})`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {onTypographyChange && (
        <details className="group border-t pt-4 mt-4">
          <summary className="font-medium cursor-pointer flex items-center gap-2">
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            Typography Overrides
          </summary>
          <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title Size</label>
              <Input
                type="text"
                value={typography.titleSize || ''}
                onChange={(e) => handleTypographyChange('titleSize', e.target.value)}
                placeholder="e.g., text-xl, text-2xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle Size</label>
              <Input
                type="text"
                value={typography.subtitleSize || ''}
                onChange={(e) => handleTypographyChange('subtitleSize', e.target.value)}
                placeholder="e.g., text-lg, text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Body Size</label>
              <Input
                type="text"
                value={typography.bodySize || ''}
                onChange={(e) => handleTypographyChange('bodySize', e.target.value)}
                placeholder="e.g., text-base, text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Caption Size</label>
              <Input
                type="text"
                value={typography.captionSize || ''}
                onChange={(e) => handleTypographyChange('captionSize', e.target.value)}
                placeholder="e.g., text-sm, text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Size</label>
              <Input
                type="text"
                value={typography.metaSize || ''}
                onChange={(e) => handleTypographyChange('metaSize', e.target.value)}
                placeholder="e.g., text-sm, text-xs"
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
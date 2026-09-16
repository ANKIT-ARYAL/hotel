'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2, Upload, X } from 'lucide-react'
import { HomepageSettings } from '@/components/homepage/types'
import { updateHomepageSettings } from '@/app/actions/homepage-settings'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updatePaymentSettings } from '@/app/actions/payment-settings'
import { PaymentSettings } from '@/lib/payment-settings-types'

const HEADING_FONTS = [
  { value: 'font-argine', label: 'Cormorant Garamond', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'font-playfair', label: 'Playfair Display', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'font-cinzel', label: 'Cinzel', preview: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG' },
  { value: 'font-prata', label: 'Prata', preview: 'The quick brown fox jumps over the lazy dog' },
]

const BODY_FONTS = [
  { value: 'font-oklean', label: 'Outfit', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'font-sans', label: 'Inter', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'font-nove', label: 'Syne', preview: 'The quick brown fox jumps over the lazy dog' },
  { value: 'font-lora', label: 'Lora', preview: 'The quick brown fox jumps over the lazy dog' },
]

export function SettingsClientView({ 
  initialSettings, 
  initialHomepageSettings,
  initialPaymentSettings
}: { 
  initialSettings: any[],
  initialHomepageSettings: HomepageSettings,
  initialPaymentSettings: PaymentSettings
}) {
  const [hpSettings, setHpSettings] = useState<HomepageSettings>(initialHomepageSettings)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(initialPaymentSettings)
  const [isSavingHp, setIsSavingHp] = useState(false)
  const [isSavingPayment, setIsSavingPayment] = useState(false)
  const router = useRouter()

  const handleSaveTheme = async () => {
    setIsSavingHp(true)
    await updateHomepageSettings(hpSettings)
    setIsSavingHp(false)
    toast.success('Settings saved!');
    router.refresh()
  }

  const updateThemeField = (field: keyof HomepageSettings['theme'], val: any) => {
    setHpSettings(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: val }
    }))
  }

  const handleSavePayment = async () => {
    setIsSavingPayment(true)
    await updatePaymentSettings(paymentSettings)
    setIsSavingPayment(false)
    toast.success('Settings saved!');
    router.refresh()
  }

  const updatePaymentField = (field: keyof PaymentSettings, val: any) => {
    setPaymentSettings(prev => ({
      ...prev,
      [field]: val
    }))
  }

  const [isUploadingQr, setIsUploadingQr] = useState(false)

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    
    setIsUploadingQr(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      
      updatePaymentField('qrCodeImageUrl', data.url)
    } catch (error) {
      console.error(error)
      alert('Failed to upload image')
    } finally {
      setIsUploadingQr(false)
      // Reset input so the same file can be selected again if needed
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Settings</h1>
          <p className="text-base text-gray-500 mt-1">Manage global environment variables and website theme.</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Website Aesthetics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Heading Typography</CardTitle>
              <CardDescription>Global font family used for headings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select 
                  value={hpSettings.theme.headingFontFamily}
                  onValueChange={(val) => updateThemeField('headingFontFamily', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a heading font" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEADING_FONTS.map(font => (
                      <SelectItem key={font.value} value={font.value} className={font.value}>
                        <div className="flex flex-col space-y-1 py-1">
                          <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">{font.label}</span>
                          <span className="text-lg">{font.preview}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Live Preview Box */}
              <div className={`mt-4 p-6 bg-zinc-50 border rounded-md text-center ${hpSettings.theme.headingFontFamily}`}>
                <h3 className="text-3xl mb-2">Heading Preview</h3>
                <h4 className="text-xl">Subtitle Preview</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Body Typography</CardTitle>
              <CardDescription>Global font family used for body text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Select 
                  value={hpSettings.theme.fontFamily}
                  onValueChange={(val) => updateThemeField('fontFamily', val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a body font" />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_FONTS.map(font => (
                      <SelectItem key={font.value} value={font.value} className={font.value}>
                        <div className="flex flex-col space-y-1 py-1">
                          <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">{font.label}</span>
                          <span className="text-base">{font.preview}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Live Preview Box */}
              <div className={`mt-4 p-6 bg-zinc-50 border rounded-md ${hpSettings.theme.fontFamily}`}>
                <p className="text-base leading-relaxed">
                  This is a live preview of the body text. It demonstrates how standard paragraphs and descriptions will appear across the website. The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end pt-2">
          <Button onClick={handleSaveTheme} disabled={isSavingHp} size="lg" className="w-40 bg-zinc-900 text-white hover:bg-zinc-800">
            {isSavingHp ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2"/> Save Theme</>}
          </Button>
        </div>
      </div>

      <div className="space-y-6 pt-12 border-t border-gray-200">
        <h2 className="text-2xl font-semibold tracking-tight">Payment Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Reservation Fee</CardTitle>
              <CardDescription>Configure reservation fee requirements for bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Payment Options</label>
                  <p className="text-sm text-gray-500">Require guests to pay a reservation fee</p>
                </div>
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-zinc-900"
                  checked={paymentSettings.enablePaymentOptions}
                  onChange={(e) => updatePaymentField('enablePaymentOptions', e.target.checked)}
                />
              </div>

              {paymentSettings.enablePaymentOptions && (
                <div className="space-y-2 pt-4 border-t border-zinc-100">
                  <label className="text-sm font-medium">Reservation Fee Percentage (%)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={paymentSettings.reservationFeePercentage}
                    onChange={(e) => updatePaymentField('reservationFeePercentage', parseInt(e.target.value) || 20)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                  />
                  <p className="text-xs text-gray-500">Percentage of the total booking cost required upfront.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {paymentSettings.enablePaymentOptions && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Enable QR Code Payment</label>
                    <p className="text-sm text-gray-500">Allow manual payment via QR scan</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-zinc-900"
                    checked={paymentSettings.enableQrCode}
                    onChange={(e) => updatePaymentField('enableQrCode', e.target.checked)}
                  />
                </div>

                {paymentSettings.enableQrCode && (
                  <div className="space-y-4 pl-4 border-l-2 border-zinc-100">
                    <label className="text-sm font-medium block">QR Code Image</label>
                    {paymentSettings.qrCodeImageUrl ? (
                      <div className="relative inline-block border border-zinc-200 rounded-md overflow-hidden bg-zinc-50 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={paymentSettings.qrCodeImageUrl} 
                          alt="QR Code Preview" 
                          className="h-32 w-auto object-contain"
                        />
                        <button 
                          onClick={() => updatePaymentField('qrCodeImageUrl', '')}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-zinc-100 border border-zinc-200 text-zinc-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-zinc-200 rounded-md p-6 text-center hover:bg-zinc-50 transition-colors">
                        <label className="cursor-pointer flex flex-col items-center gap-2">
                          {isUploadingQr ? (
                            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                          ) : (
                            <Upload className="w-6 h-6 text-zinc-400" />
                          )}
                          <span className="text-sm text-zinc-500 font-medium">
                            {isUploadingQr ? 'Uploading...' : 'Click to upload QR code'}
                          </span>
                          <input 
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleQrUpload}
                            disabled={isUploadingQr}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Enable Credit Card (Stripe)</label>
                    <p className="text-sm text-gray-500">Process cards securely via Stripe</p>
                  </div>
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-zinc-900"
                    checked={paymentSettings.enableStripe}
                    onChange={(e) => updatePaymentField('enableStripe', e.target.checked)}
                  />
                </div>

                {paymentSettings.enableStripe && (
                  <div className="space-y-4 pl-4 border-l-2 border-zinc-100">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stripe Public Key</label>
                      <input 
                        type="text"
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => updatePaymentField('stripePublicKey', e.target.value)}
                        placeholder="pk_test_..."
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stripe Secret Key</label>
                      <input 
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => updatePaymentField('stripeSecretKey', e.target.value)}
                        placeholder="sk_test_..."
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                      />
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex justify-end pt-2">
          <Button onClick={handleSavePayment} disabled={isSavingPayment} size="lg" className="w-40 bg-zinc-900 text-white hover:bg-zinc-800">
            {isSavingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 mr-2"/> Save Payments</>}
          </Button>
        </div>
      </div>
    </div>
  )
}

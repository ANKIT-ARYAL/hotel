/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { updateHomepageSettings } from "@/app/actions/homepage-settings";
import { updatePaymentSettings } from "@/app/actions/payment-settings";
import type { HomepageSettings } from "@/components/homepage/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PaymentSettings } from "@/lib/payment-settings-types";

const HEADING_FONTS = [
  { value: "font-argine", label: "Cormorant Garamond", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-playfair", label: "Playfair Display", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-cinzel", label: "Cinzel", preview: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
  { value: "font-prata", label: "Prata", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-lora", label: "Lora", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-nove", label: "Syne", preview: "The quick brown fox jumps over the lazy dog" },
];

const BODY_FONTS = [
  { value: "font-oklean", label: "Outfit", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-sans", label: "Inter", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-nove", label: "Syne", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-lora", label: "Lora", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-playfair", label: "Playfair Display", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-prata", label: "Prata", preview: "The quick brown fox jumps over the lazy dog" },
  { value: "font-cinzel", label: "Cinzel", preview: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" },
];

const LOGO_FONTS = [
  { value: "font-nove", label: "Syne" },
  { value: "font-argine", label: "Cormorant Garamond" },
  { value: "font-playfair", label: "Playfair Display" },
  { value: "font-sans", label: "Inter" },
  { value: "font-cinzel", label: "Cinzel" },
  { value: "font-prata", label: "Prata" },
  { value: "font-lora", label: "Lora" },
];

export function SettingsClientView({
  initialSettings,
  initialHomepageSettings,
  initialPaymentSettings,
}: {
  initialSettings: any[];
  initialHomepageSettings: HomepageSettings;
  initialPaymentSettings: PaymentSettings;
}) {
  const [hpSettings, setHpSettings] = useState<HomepageSettings>(initialHomepageSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(initialPaymentSettings);
  const [isSavingHp, setIsSavingHp] = useState(false);
  const [headingTarget, setHeadingTarget] = useState<"frontend" | "admin">("frontend");
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const router = useRouter();

  const handleSaveTheme = async () => {
    setIsSavingHp(true);
    await updateHomepageSettings(hpSettings);
    setIsSavingHp(false);
    toast.success("Settings saved!");
    router.refresh();
  };

  const updateThemeField = (field: keyof HomepageSettings["theme"], val: any) => {
    setHpSettings((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: val },
    }));
  };

  const handleSavePayment = async () => {
    setIsSavingPayment(true);
    await updatePaymentSettings(paymentSettings);
    setIsSavingPayment(false);
    toast.success("Settings saved!");
    router.refresh();
  };

  const updatePaymentField = (field: keyof PaymentSettings, val: any) => {
    setPaymentSettings((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const [isUploadingQr, setIsUploadingQr] = useState(false);

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setIsUploadingQr(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      updatePaymentField("qrCodeImageUrl", data.url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingQr(false);
      if (e.target) e.target.value = "";
    }
  };

  const [isUploadingLoader, setIsUploadingLoader] = useState(false);

  const handleLoaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setIsUploadingLoader(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setHpSettings((prev) => ({
        ...prev,
        loader: { ...prev.loader, iconUrl: data.url },
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingLoader(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="tracking-tight text-gray-900" style={{ fontSize: "var(--admin-heading-size)" }}>
            System Settings
          </h1>
          <p className="text-gray-500 mt-1 text-justify tracking-tight">
            Manage global environment variables and website theme.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="tracking-tight">Website Aesthetics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Heading Typography</CardTitle>
              <CardDescription>Global font family used for headings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <Select
                    value={hpSettings.theme.headingFontFamily}
                    onValueChange={(val) => updateThemeField("headingFontFamily", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a heading font" />
                    </SelectTrigger>
                    <SelectContent>
                      {HEADING_FONTS.map((font) => (
                        <SelectItem key={font.value} value={font.value} className={font.value}>
                          <div className="flex flex-col space-y-1 py-1">
                            <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                              {font.label}
                            </span>
                            <span className="text-lg">{font.preview}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Section</label>
                    <Select
                      value={headingTarget}
                      onValueChange={(val: any) => val && setHeadingTarget(val as "frontend" | "admin")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Headers (e.g. 5.5rem)</SelectItem>
                        <SelectItem value="admin">Admin Panel Headers (e.g. 1.875rem)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Header Size</label>
                    {headingTarget === "frontend" ? (
                      <Input
                        value={hpSettings.theme.headingFontSize || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateThemeField("headingFontSize", e.target.value)
                        }
                        placeholder="e.g. 5.5rem"
                      />
                    ) : (
                      <Input
                        value={hpSettings.theme.adminHeadingFontSize || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateThemeField("adminHeadingFontSize", e.target.value)
                        }
                        placeholder="e.g. 1.875rem"
                      />
                    )}
                    <p className="text-muted-foreground text-xs text-justify tracking-tight">
                      Applies specifically to the selected target.
                    </p>
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                className={`mt-4 p-6 bg-zinc-50 border rounded-md text-center ${hpSettings.theme.headingFontFamily}`}
              >
                <h3 className="mb-2">Heading Preview</h3>
                <h4 className="">Subtitle Preview</h4>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Logo Typography</CardTitle>
              <CardDescription>Separate font family used by the frontend logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={hpSettings.theme.logoFontFamily || "font-nove"} onValueChange={(value) => updateThemeField("logoFontFamily", value)}>
                <SelectTrigger><SelectValue placeholder="Select a logo font" /></SelectTrigger>
                <SelectContent>{LOGO_FONTS.map((font) => <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>)}</SelectContent>
              </Select>
              <div className="rounded-md border bg-zinc-50 p-6 text-center text-2xl" style={{ fontFamily: "var(--theme-logo-font)" }}>HOTEL LUXURY</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Body Typography</CardTitle>
              <CardDescription>Global font family used for body text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <Select
                    value={hpSettings.theme.fontFamily}
                    onValueChange={(val) => updateThemeField("fontFamily", val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a body font" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_FONTS.map((font) => (
                        <SelectItem key={font.value} value={font.value} className={font.value}>
                          <div className="flex flex-col space-y-1 py-1">
                            <span className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                              {font.label}
                            </span>
                            <span className="text-base">{font.preview}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Body Font Size</label>
                  <Input
                    value={hpSettings.theme.bodyFontSize || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateThemeField("bodyFontSize", e.target.value)
                    }
                    placeholder="e.g. 16px or 1rem"
                  />
                  <p className="text-muted-foreground text-justify tracking-tight">Applies to all paragraphs.</p>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className={`mt-4 p-6 bg-zinc-50 border rounded-md ${hpSettings.theme.fontFamily}`}>
                <p className="leading-relaxed text-justify tracking-tight">
                  This is a live preview of the body text. It demonstrates how standard paragraphs and descriptions will
                  appear across the website. The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle>Loader Configuration</CardTitle>
              <CardDescription>Configure the startup loading screen icon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <label className="text-sm font-medium block">Loader Icon (Upload Image)</label>
                {hpSettings.loader.iconUrl ? (
                  <div className="relative inline-block border border-zinc-200 rounded-md overflow-hidden bg-zinc-900 p-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hpSettings.loader.iconUrl}
                      alt="Loader Preview"
                      className="h-20 w-auto object-contain invert"
                    />
                    <button
                      onClick={() => setHpSettings((prev) => ({ ...prev, loader: { ...prev.loader, iconUrl: "" } }))}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:bg-zinc-100 border border-zinc-200 text-zinc-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-zinc-200 rounded-md p-8 text-center hover:bg-zinc-50 transition-colors">
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      {isUploadingLoader ? (
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                      ) : (
                        <Upload className="w-8 h-8 text-zinc-400" />
                      )}
                      <span className="text-sm text-zinc-500 font-medium">
                        {isUploadingLoader ? "Uploading..." : "Click to upload loader icon"}
                      </span>
                      <p className="text-xs text-zinc-400">
                        If no image is uploaded, a text-based fallback matching your logo will be displayed.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLoaderUpload}
                        disabled={isUploadingLoader}
                      />
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveTheme}
            disabled={isSavingHp}
            size="lg"
            className="w-40 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {isSavingHp ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Theme
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6 pt-12 border-t border-gray-200">
        <h2 className="tracking-tight">Payment Configuration</h2>

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
                  <p className="text-gray-500 text-justify tracking-tight">Require guests to pay a reservation fee</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-zinc-900"
                  checked={paymentSettings.enablePaymentOptions}
                  onChange={(e) => updatePaymentField("enablePaymentOptions", e.target.checked)}
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
                    onChange={(e) => updatePaymentField("reservationFeePercentage", parseInt(e.target.value) || 20)}
                    className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                  />
                  <p className="text-gray-500 text-justify tracking-tight">
                    Percentage of the total booking cost required upfront.
                  </p>
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
                    <p className="text-gray-500 text-justify tracking-tight">Allow manual payment via QR scan</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-zinc-900"
                    checked={paymentSettings.enableQrCode}
                    onChange={(e) => updatePaymentField("enableQrCode", e.target.checked)}
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
                          onClick={() => updatePaymentField("qrCodeImageUrl", "")}
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
                            {isUploadingQr ? "Uploading..." : "Click to upload QR code"}
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
                    <p className="text-gray-500 text-justify tracking-tight">Process cards securely via Stripe</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-zinc-900"
                    checked={paymentSettings.enableStripe}
                    onChange={(e) => updatePaymentField("enableStripe", e.target.checked)}
                  />
                </div>

                {paymentSettings.enableStripe && (
                  <div className="space-y-4 pl-4 border-l-2 border-zinc-100">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stripe Public Key</label>
                      <input
                        type="text"
                        value={paymentSettings.stripePublicKey}
                        onChange={(e) => updatePaymentField("stripePublicKey", e.target.value)}
                        placeholder="pk_test_..."
                        className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stripe Secret Key</label>
                      <input
                        type="password"
                        value={paymentSettings.stripeSecretKey}
                        onChange={(e) => updatePaymentField("stripeSecretKey", e.target.value)}
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
          <Button
            onClick={handleSavePayment}
            disabled={isSavingPayment}
            size="lg"
            className="w-40 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {isSavingPayment ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Save Payments
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

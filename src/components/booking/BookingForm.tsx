"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, CreditCard, Loader2, QrCode } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { submitBooking } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const bookingSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "First name is required")
      .refine((s) => s.trim().length > 0, "Cannot be just spaces"),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name is required")
      .refine((s) => s.trim().length > 0, "Cannot be just spaces"),
    email: z.string().trim().email("Invalid email address"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number (10-15 digits)"),
    paymentMethod: z.enum(["QR", "CREDIT_CARD"]),
    paymentRefId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === "QR" && (!data.paymentRefId || data.paymentRefId.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reference ID is required for QR payments",
        path: ["paymentRefId"],
      });
    }
  });

type BookingFormData = z.infer<typeof bookingSchema>;

export function BookingForm({ roomId, arrival, departure }: { roomId: string; arrival: string; departure: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      paymentMethod: "CREDIT_CARD",
    },
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const res = await submitBooking({
        ...data,
        roomId,
        arrival,
        departure,
      });

      if (res.success) {
        setIsSuccess(true);
        setBookingId(res.bookingId || null);
      } else {
        toast.error(res.error || "Failed to process booking.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-10 rounded-3xl shadow-xl shadow-zinc-200/50 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-3xl font-argine text-zinc-900 mb-4">Booking Confirmed!</h3>
        <p className="text-zinc-500 font-oklean mb-6 max-w-md">
          Your reservation has been successfully processed. We have sent a confirmation email with your itinerary
          details.
        </p>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-6 py-4 mb-8">
          <p className="text-sm font-medium text-zinc-700">Booking Reference</p>
          <p className="text-lg font-mono font-bold text-zinc-900">{bookingId?.slice(0, 8).toUpperCase()}</p>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="bg-zinc-900 text-white hover:bg-zinc-800 h-12 px-8 rounded-full font-medium"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-zinc-200/50 space-y-8"
    >
      {/* Guest Details */}
      <div>
        <h3 className="text-xl font-argine text-zinc-900 mb-6 border-b pb-4">Guest Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">First Name</label>
            <Input
              {...register("firstName")}
              className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
              placeholder="John"
            />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Last Name</label>
            <Input
              {...register("lastName")}
              className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
              placeholder="Doe"
            />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Email Address</label>
            <Input
              {...register("email")}
              className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700">Phone Number</label>
            <Input
              {...register("phone")}
              className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h3 className="text-xl font-argine text-zinc-900 mb-6 border-b pb-4">Payment Method</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            onClick={() => setValue("paymentMethod", "CREDIT_CARD")}
            className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${paymentMethod === "CREDIT_CARD" ? "border-zinc-900 bg-zinc-900/5 text-zinc-900" : "border-zinc-200 hover:border-zinc-300 text-zinc-500"}`}
          >
            <CreditCard className="w-8 h-8" />
            <span className="font-medium text-sm">Credit Card</span>
          </div>
          <div
            onClick={() => setValue("paymentMethod", "QR")}
            className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${paymentMethod === "QR" ? "border-zinc-900 bg-zinc-900/5 text-zinc-900" : "border-zinc-200 hover:border-zinc-300 text-zinc-500"}`}
          >
            <QrCode className="w-8 h-8" />
            <span className="font-medium text-sm">QR Code</span>
          </div>
        </div>

        {paymentMethod === "CREDIT_CARD" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Card Number</label>
              <Input
                className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Expiry</label>
                <Input
                  className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">CVC</label>
                <Input
                  className="h-12 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
                  placeholder="123"
                  type="password"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "QR" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 text-center bg-zinc-50 p-6 rounded-xl border border-zinc-200">
            <div className="w-48 h-48 bg-white border-2 border-zinc-200 rounded-xl mx-auto flex items-center justify-center">
              <QrCode className="w-24 h-24 text-zinc-300" />
            </div>
            <p className="text-sm text-zinc-500 font-medium">Scan this code with your banking app to pay</p>

            <div className="space-y-2 text-left max-w-sm mx-auto">
              <label className="text-sm font-medium text-zinc-700">Payment Reference ID *</label>
              <Input
                {...register("paymentRefId")}
                className="h-12 bg-white border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 rounded-xl"
                placeholder="e.g. TXN-123456789"
              />
              {errors.paymentRefId && <p className="text-red-500 text-xs">{errors.paymentRefId.message}</p>}
            </div>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 h-14 rounded-full font-medium tracking-wide shadow-md"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
        {isSubmitting ? "Processing Payment..." : "Confirm Reservation"}
      </Button>
    </form>
  );
}

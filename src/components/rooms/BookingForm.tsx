"use client";

import type React from "react";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import type { PaymentSettings } from "@/lib/payment-settings-types";

import { StripePaymentProvider } from "./StripePaymentForm";

const bookingSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.checkIn);
      const end = new Date(data.checkOut);
      return end > start;
    },
    {
      message: "Check-out must be after check-in",
      path: ["checkOut"],
    },
  );

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  roomId: string;
  roomNumber: string;
  price: number;
  paymentSettings?: PaymentSettings;
}

export function BookingForm({ roomId, roomNumber, price, paymentSettings }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"QR" | "CREDIT_CARD">("CREDIT_CARD");
  const [qrRefId, setQrRefId] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    trigger,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  let days = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end > start) {
      days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  const total = days > 0 ? days * price : 0;

  const requiresPayment =
    paymentSettings?.enablePaymentOptions && (paymentSettings?.enableQrCode || paymentSettings?.enableStripe);
  const reservationFee = requiresPayment ? total * (paymentSettings.reservationFeePercentage / 100) : 0;

  const handleNextStep = async (e: React.MouseEvent) => {
    e.preventDefault();
    const isValid = await trigger();
    if (isValid) {
      if (requiresPayment) {
        setStep(2);
      } else {
        // Just submit directly if no payment needed
        handleSubmit((data) => onSubmit(data))();
      }
    }
  };

  const onSubmit = async (data: BookingFormValues, paymentMethod?: string, paymentRefId?: string, amount?: number) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          roomId,
          totalAmount: total,
          paymentMethod,
          paymentRefId,
          paymentAmount: amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking");
      }

      setStep(3);
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQrSubmit = () => {
    if (!qrRefId.trim()) {
      toast.error("Please enter the reference ID");
      return;
    }
    handleSubmit((data) => onSubmit(data, "QR", qrRefId, reservationFee))();
  };

  const handleStripeSuccess = (paymentIntentId: string) => {
    handleSubmit((data) => onSubmit(data, "CREDIT_CARD", paymentIntentId, reservationFee))();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="bg-white p-8 border border-zinc-100 rounded-sm shadow-xl shadow-zinc-200/50 flex flex-col gap-6"
    >
      <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
        <h3 className="text-2xl text-zinc-900">Reserve Room {roomNumber}</h3>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium leading-none">Rate</span>
          <span className="text-2xl font-medium text-zinc-900 leading-none">
            ${price} <span className="text-sm text-zinc-500 font-light">/ Night</span>
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Full Name *</label>
                <input
                  {...register("name")}
                  className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Email Address *</label>
                <input
                  {...register("email")}
                  type="email"
                  className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Phone Number</label>
              <input
                {...register("phone")}
                type="tel"
                className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Check-In *</label>
                <input
                  {...register("checkIn")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                />
                {errors.checkIn && <span className="text-xs text-red-500">{errors.checkIn.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Check-Out *</label>
                <input
                  {...register("checkOut")}
                  type="date"
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors"
                />
                {errors.checkOut && <span className="text-xs text-red-500">{errors.checkOut.message}</span>}
              </div>
            </div>

            <div className="bg-zinc-50 p-6 flex justify-between items-center border border-zinc-100 mt-4">
              <div>
                <span className="block text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Total Estimate
                </span>
                <span className="text-sm text-zinc-400">
                  {days} {days === 1 ? "Night" : "Nights"} at ${price}/night
                </span>
              </div>
              <div className="text-3xl text-zinc-900 font-medium">${total.toFixed(2)}</div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-widest text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? "Processing..." : requiresPayment ? "Next Step" : "Confirm Reservation"}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 border-b border-zinc-100 pb-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                ← Back
              </button>
              <h4 className="font-medium text-lg">Secure your Reservation</h4>
            </div>

            <div className="bg-zinc-50 p-4 border border-zinc-100 flex justify-between items-center">
              <div>
                <span className="block text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Required Fee ({paymentSettings?.reservationFeePercentage}%)
                </span>
              </div>
              <div className="text-xl text-zinc-900 font-medium">${reservationFee.toFixed(2)}</div>
            </div>

            <div className="flex gap-4 mb-4">
              {paymentSettings?.enableStripe && (
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("CREDIT_CARD")}
                  className={`flex-1 h-12 border transition-colors uppercase tracking-widest text-xs font-medium ${
                    selectedPaymentMethod === "CREDIT_CARD"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900"
                  }`}
                >
                  Credit Card
                </button>
              )}
              {paymentSettings?.enableQrCode && (
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod("QR")}
                  className={`flex-1 h-12 border transition-colors uppercase tracking-widest text-xs font-medium ${
                    selectedPaymentMethod === "QR"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900"
                  }`}
                >
                  QR Transfer
                </button>
              )}
            </div>

            {selectedPaymentMethod === "QR" && paymentSettings?.enableQrCode && (
              <div className="flex flex-col gap-6 items-center text-center border border-zinc-100 p-6">
                <p className="text-sm text-zinc-500">Scan the QR code below to transfer the reservation fee.</p>
                {paymentSettings.qrCodeImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={paymentSettings.qrCodeImageUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                )}

                <div className="w-full flex flex-col gap-2 text-left">
                  <label className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
                    Transfer Reference ID *
                  </label>
                  <input
                    type="text"
                    value={qrRefId}
                    onChange={(e) => setQrRefId(e.target.value)}
                    className="h-12 px-4 border border-zinc-200 focus:border-zinc-900 outline-none transition-colors w-full"
                    placeholder="e.g. TXN-12345678"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleQrSubmit}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-widest text-sm font-medium disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? "Processing..." : "Submit Payment Details"}
                </button>
              </div>
            )}

            {selectedPaymentMethod === "CREDIT_CARD" &&
              paymentSettings?.enableStripe &&
              paymentSettings.stripePublicKey && (
                <div className="mt-4">
                  <StripePaymentProvider
                    amount={reservationFee}
                    stripePublicKey={paymentSettings.stripePublicKey}
                    onSuccess={handleStripeSuccess}
                    onCancel={() => setStep(1)}
                  />
                </div>
              )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center gap-4"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl text-zinc-900">Booking Confirmed!</h3>
            <p className="text-zinc-500 max-w-sm">
              Your booking has been confirmed. You will soon receive the details of the booking in your email.
            </p>
            <a
              href={`mailto:${watch("email")}`}
              className="mt-4 px-6 py-3 bg-zinc-900 text-white rounded-sm hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs font-medium"
            >
              Check your email: {watch("email")}
            </a>

            <button
              onClick={() => {
                reset();
                setStep(1);
              }}
              className="mt-6 text-sm text-zinc-400 hover:text-zinc-900 transition-colors underline underline-offset-4"
            >
              Make another booking
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

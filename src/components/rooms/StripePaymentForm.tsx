"use client";

import type React from "react";
import { useEffect, useState } from "react";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

interface StripePaymentFormProps {
  amount: number;
  stripePublicKey: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

function CheckoutForm({
  amount,
  onSuccess,
  onCancel,
}: {
  amount: number;
  onSuccess: (id: string) => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin, // Not actually used since we redirect: 'if_required'
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 border border-zinc-200 rounded-md">
        <PaymentElement />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-12 bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 transition-colors uppercase tracking-widest text-xs font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isProcessing || !stripe}
          className="flex-1 h-12 bg-zinc-900 text-white hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs font-medium disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
}

export function StripePaymentProvider({ amount, stripePublicKey, onSuccess, onCancel }: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState("");

  // Calculate amount in cents
  const amountInCents = Math.round(amount * 100);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInCents }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error(data.error || "Failed to initialize payment");
        }
      })
      .catch(() => {
        toast.error("Failed to initialize payment");
      });
  }, [amountInCents]);

  if (!clientSecret) {
    return <div className="p-8 text-center text-zinc-500">Loading secure payment...</div>;
  }

  const stripePromise = loadStripe(stripePublicKey);

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  );
}

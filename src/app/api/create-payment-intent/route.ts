import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPaymentSettings } from '@/app/actions/payment-settings';

export async function POST(req: Request) {
  try {
    const paymentSettings = await getPaymentSettings();
    if (!paymentSettings.enableStripe || !paymentSettings.stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe payments are not enabled or configured.' }, { status: 400 });
    }

    // Use the default apiVersion or the one expected by the current SDK
    const stripe = new Stripe(paymentSettings.stripeSecretKey, {
      apiVersion: '2025-01-27.acacia' as any, // fallback to any to bypass strict version mismatch if needed
    });

    const body = await req.json();
    const { amount, currency = 'usd' } = body; // Amount should be in cents for Stripe

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount provided' }, { status: 400 });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Stripe PaymentIntent Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

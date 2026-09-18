export interface PaymentSettings {
  enablePaymentOptions: boolean;
  reservationFeePercentage: number;
  enableQrCode: boolean;
  qrCodeImageUrl: string;
  enableStripe: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
}

export const defaultPaymentSettings: PaymentSettings = {
  enablePaymentOptions: false,
  reservationFeePercentage: 20,
  enableQrCode: false,
  qrCodeImageUrl: "",
  enableStripe: false,
  stripePublicKey: "",
  stripeSecretKey: "",
};

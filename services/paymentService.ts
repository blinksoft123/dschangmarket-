import { MobileMoneyResponse } from '../types';

/**
 * SIMULATION OF MOBILE MONEY INTEGRATION
 * In production, this would call the REST APIs of MTN MoMo or Orange Money.
 * Typically requires:
 * 1. Request to Pay (Push USSD)
 * 2. Polling for status or Webhook listener
 */

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initiateMobileMoneyPayment = async (
  provider: 'mtn' | 'orange',
  phoneNumber: string,
  amount: number
): Promise<MobileMoneyResponse> => {
  console.log(`[PaymentGateway] Initiating ${provider.toUpperCase()} payment for ${amount} FCFA to ${phoneNumber}`);
  
  // Simulate network latency
  await delay(2000);

  // Validate phone number format (simple check for Cameroon)
  const isValidPhone = /^(6|2)[0-9]{8}$/.test(phoneNumber);
  
  if (!isValidPhone) {
     return {
       success: false,
       message: 'Numéro de téléphone invalide. Utilisez un format camerounais (ex: 699...)'
     };
  }

  // Simulate success rate (90% success)
  const isSuccessful = Math.random() > 0.1;

  if (isSuccessful) {
    return {
      success: true,
      transactionId: `${provider.toUpperCase()}-${Date.now()}`,
      message: 'Paiement effectué avec succès. Votre commande est confirmée.'
    };
  } else {
    return {
      success: false,
      message: 'Le paiement a échoué ou a été annulé par l\'utilisateur. Veuillez réessayer.'
    };
  }
};

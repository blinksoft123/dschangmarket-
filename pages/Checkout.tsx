import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { initiateMobileMoneyPayment } from '../services/paymentService';
import { createOrder } from '../services/api';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const Checkout: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'orange'>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
        <Link to="/" className="text-brand-600 hover:underline">Retourner à la boutique</Link>
      </div>
    );
  }

  const handlePayment = async () => {
    if (!phoneNumber || !address || !fullName) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      // 1. Process Payment Mock
      const paymentResponse = await initiateMobileMoneyPayment(paymentMethod, phoneNumber, cartTotal);
      
      if (paymentResponse.success) {
        // 2. Get User ID (Optional)
        const { data: { user } } = await supabase.auth.getUser();

        // 3. Create Order in Supabase
        await createOrder(
          user ? user.id : null,
          cartItems,
          cartTotal,
          address,
          paymentMethod,
          paymentResponse.transactionId || 'MOCK-TX'
        );

        clearCart();
        setStep('success');
      } else {
        setError(paymentResponse.message);
      }
    } catch (err: any) {
      console.error(err);
      setError('Une erreur est survenue lors de la commande: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white rounded-lg shadow p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Commande Confirmée !</h2>
        <p className="text-gray-600 mb-8">
          Merci pour votre achat. Un SMS de confirmation a été envoyé au {phoneNumber}.
          Vos articles seront livrés bientôt à {address}.
        </p>
        <Link to="/" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold">
          Continuer les achats
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Form */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Informations de livraison
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input 
                type="text" 
                placeholder="Nom complet" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border p-3 rounded bg-gray-50 w-full" 
             />
             <input 
                type="text" 
                placeholder="Quartier / Ville" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-3 rounded bg-gray-50 w-full" 
             />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="bg-brand-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Paiement
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <button 
                onClick={() => setPaymentMethod('mtn')}
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 ${paymentMethod === 'mtn' ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400' : 'border-gray-200'}`}
              >
                <div className="font-bold text-yellow-700">MTN MoMo</div>
              </button>
              <button 
                onClick={() => setPaymentMethod('orange')}
                className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 ${paymentMethod === 'orange' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200'}`}
              >
                <div className="font-bold text-orange-600">Orange Money</div>
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Numéro payeur ({paymentMethod === 'mtn' ? 'MTN' : 'Orange'})</label>
              <input 
                type="text" 
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ex: 6XXXXXXXX"
                className="w-full border p-3 rounded focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
          <h3 className="font-bold text-lg mb-4">Résumé de la commande</h3>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.product.title} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium">
                  {((item.product.sale_price || item.product.price) * item.quantity).toLocaleString()} FCFA
                </span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{cartTotal.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>1 000 FCFA</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-brand-700 pt-2 border-t mt-2">
              <span>Total</span>
              <span>{(cartTotal + 1000).toLocaleString()} FCFA</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mt-4">
              {error}
            </div>
          )}

          <button 
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-brand-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Traitement...' : 'Payer Maintenant'}
          </button>
          
          <p className="text-xs text-center text-gray-400 mt-4">
            Paiement sécurisé. En cliquant, vous recevrez une invite USSD sur votre téléphone.
          </p>
        </div>
      </div>
    </div>
  );
};

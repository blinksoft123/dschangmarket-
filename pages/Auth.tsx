import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Store, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- LOGIN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Check profile to redirect accordingly
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Check role to redirect sellers to dashboard
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile?.role === 'seller') {
            navigate('/seller/dashboard');
          } else {
            navigate('/');
          }
        }
      } else {
        // --- SIGNUP ---
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
              role: role,
            }
          }
        });
        
        if (error) throw error;
        
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isLogin ? 'Bon retour !' : 'Créer un compte'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Accédez à votre compte DschangMarket" : "Rejoignez la plus grande marketplace locale"}
          </p>
        </div>

        {/* Toggle Login/Signup */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Connexion
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inscription
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleAuth}>
          
          {/* Sign Up Specific Fields */}
          {!isLogin && (
            <>
              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div 
                  onClick={() => setRole('buyer')}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'buyer' ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <ShoppingBag className={role === 'buyer' ? 'text-brand-600' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${role === 'buyer' ? 'text-brand-900' : 'text-gray-500'}`}>Acheteur</span>
                </div>
                <div 
                  onClick={() => setRole('seller')}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${role === 'seller' ? 'border-brand-500 bg-brand-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <Store className={role === 'seller' ? 'text-brand-600' : 'text-gray-400'} />
                  <span className={`text-sm font-bold ${role === 'seller' ? 'text-brand-900' : 'text-gray-500'}`}>Vendeur</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Nom complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Numéro de téléphone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Common Fields */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Adresse Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
              <span className="block w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-200"
          >
            {loading && <Loader2 className="animate-spin h-4 w-4" />}
            {isLogin ? 'Se connecter' : "Créer mon compte"}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>
        
        <div className="text-center">
            <a href="#" className="text-xs text-gray-500 hover:text-brand-600">Mot de passe oublié ?</a>
        </div>
      </div>
    </div>
  );
};

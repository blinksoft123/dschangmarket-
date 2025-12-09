import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, MapPin, Phone, Heart, LogOut } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabaseClient';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
       setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Top Bar */}
      <div className="bg-brand-900 text-white text-xs py-2 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={12} /> +237 699 00 00 00</span>
            <span className="hidden sm:flex items-center gap-1"><MapPin size={12} /> Dschang, Cameroun</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/seller/dashboard" className="cursor-pointer hover:text-brand-100">Devenir Vendeur</Link>
            <span className="cursor-pointer hover:text-brand-100">Aide & FAQ</span>
            <span className="cursor-pointer hover:text-brand-100">FR | EN</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-brand-600 flex-shrink-0">
              Dschang<span className="text-gray-800">Market</span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <input 
                type="text" 
                placeholder="Rechercher un produit, une marque..." 
                className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-l-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <button className="bg-brand-600 text-white px-6 py-2.5 rounded-r-lg hover:bg-brand-700 transition">
                <Search size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 text-gray-700">
              {user ? (
                <>
                  <Link to="/seller/dashboard" className="hidden lg:flex flex-col items-center text-xs hover:text-brand-600">
                    <User size={24} />
                    <span>Compte</span>
                  </Link>
                  <button onClick={handleLogout} className="hidden lg:flex flex-col items-center text-xs hover:text-red-600">
                    <LogOut size={24} />
                    <span>Déco.</span>
                  </button>
                </>
              ) : (
                <Link to="/auth" className="hidden lg:flex flex-col items-center text-xs hover:text-brand-600">
                    <User size={24} />
                    <span>Connexion</span>
                </Link>
              )}
              
              <div className="hidden lg:flex flex-col items-center text-xs hover:text-brand-600 cursor-pointer">
                <Heart size={24} />
                <span>Favoris</span>
              </div>
              <Link to="/cart" className="flex flex-col items-center text-xs hover:text-brand-600 relative">
                <div className="relative">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Panier</span>
              </Link>
              <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation / Mega Menu Placeholder */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-8 text-sm font-medium text-gray-700 py-3">
              <li className="flex items-center gap-1 cursor-pointer hover:text-brand-600">
                Toutes les Catégories <ChevronDown size={14} />
              </li>
              <li className="cursor-pointer hover:text-brand-600">Électronique</li>
              <li className="cursor-pointer hover:text-brand-600">Mode</li>
              <li className="cursor-pointer hover:text-brand-600">Maison & Bureau</li>
              <li className="cursor-pointer hover:text-brand-600">Supermarché</li>
              <li className="ml-auto text-brand-600 font-semibold cursor-pointer">Offres Spéciales</li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">DschangMarket</h3>
            <p className="text-sm leading-relaxed">
              Le plus grand marché en ligne de l'Ouest Cameroun. Achetez et vendez en toute confiance avec livraison locale rapide.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">A propos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Qui sommes-nous</a></li>
              <li><a href="#" className="hover:text-white">Carrières</a></li>
              <li><a href="#" className="hover:text-white">Conditions Générales</a></li>
              <li><a href="#" className="hover:text-white">Politique de Confidentialité</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Service Client</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-white">Comment acheter</a></li>
              <li><a href="#" className="hover:text-white">Expédition & Livraison</a></li>
              <li><a href="#" className="hover:text-white">Retour & Remboursement</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Paiement & Livraison</h4>
            <div className="flex gap-2 mb-4">
               {/* Placeholders for payment icons */}
               <div className="bg-white text-black text-xs p-1 font-bold rounded">MTN</div>
               <div className="bg-white text-black text-xs p-1 font-bold rounded">Orange</div>
               <div className="bg-white text-black text-xs p-1 font-bold rounded">Visa</div>
            </div>
            <p className="text-xs">Livraison sécurisée partout à Dschang et environs.</p>
          </div>
        </div>
        <div className="text-center text-xs border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} Dschang HyperMarket. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

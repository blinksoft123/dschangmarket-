import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../services/api';
import { Product } from '../types';
import { ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl overflow-hidden relative text-white h-[300px] md:h-[400px] flex items-center">
          <div className="p-8 md:p-12 relative z-10 max-w-lg">
            <span className="text-brand-500 font-bold tracking-wider text-sm uppercase mb-2 block">Dschang HyperMarket</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">La technologie au meilleur prix</h1>
            <p className="text-gray-300 mb-8">Découvrez les derniers smartphones et laptops. Livraison gratuite à Dschang pour toute commande de plus de 50,000 FCFA.</p>
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              Acheter Maintenant
            </button>
          </div>
          <div className="absolute right-0 bottom-0 md:-right-20 md:-bottom-40 w-80 h-80 bg-brand-500 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="hidden md:flex flex-col gap-4">
          <div className="bg-orange-100 rounded-xl flex-1 p-6 flex flex-col justify-center items-start text-orange-900">
            <span className="font-bold text-lg">Mode Homme</span>
            <p className="text-sm mb-4 text-orange-800">Nouvelle Collection</p>
            <button className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Voir plus <ArrowRight size={14} /></button>
          </div>
          <div className="bg-blue-100 rounded-xl flex-1 p-6 flex flex-col justify-center items-start text-blue-900">
            <span className="font-bold text-lg">Accessoires</span>
            <p className="text-sm mb-4 text-blue-800">-20% cette semaine</p>
            <button className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">Voir plus <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 p-2">
          <div className="bg-brand-100 p-3 rounded-full text-brand-600">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Livraison Rapide</h4>
            <p className="text-xs text-gray-500">Expédition locale en 24h</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-2">
          <div className="bg-brand-100 p-3 rounded-full text-brand-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Paiement Sécurisé</h4>
            <p className="text-xs text-gray-500">Mobile Money & Cash à la livraison</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-2">
          <div className="bg-brand-100 p-3 rounded-full text-brand-600">
            <Headphones size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Support 24/7</h4>
            <p className="text-xs text-gray-500">Contactez-nous à tout moment</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Meilleures Ventes</h2>
          <a href="#" className="text-brand-600 text-sm font-medium hover:underline">Voir tout</a>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
             ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-12 text-gray-500">Aucun produit disponible pour le moment.</div>
        )}
      </div>

       <div className="bg-gray-900 text-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Vendez sur DschangMarket</h3>
            <p className="text-gray-400">Créez votre boutique en ligne en quelques minutes et touchez des milliers de clients.</p>
          </div>
          <button className="bg-brand-600 hover:bg-brand-700 px-6 py-3 rounded font-bold whitespace-nowrap">
            Commencer à vendre
          </button>
       </div>
    </div>
  );
};

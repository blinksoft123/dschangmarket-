import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/api';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { Star, ShoppingCart, Truck, RefreshCw, Plus, Minus } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
        getProductById(id).then(data => {
            setProduct(data);
            setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center">Chargement...</div>;
  if (!product) return <div className="p-8 text-center">Produit non trouvé</div>;

  const displayImage = product.images && product.images.length > 0 
    ? product.images[activeImage] 
    : 'https://via.placeholder.com/400';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative group">
             <img 
              src={displayImage} 
              alt={product.title} 
              className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden ${activeImage === idx ? 'border-brand-500 ring-1 ring-brand-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-sm text-brand-600 font-medium tracking-wide uppercase">
            {product.store_name}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400 text-sm">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} fill={i < Math.round(product.rating_avg) ? "currentColor" : "none"} />
               ))}
            </div>
            <span className="text-gray-500 text-sm border-l pl-4">{product.rating_count} avis</span>
            <span className="text-green-600 text-sm border-l pl-4 font-medium">En stock: {product.stock_quantity}</span>
          </div>

          <div className="text-4xl font-bold text-brand-700 mb-2">
             {(product.sale_price || product.price).toLocaleString('fr-FR')} FCFA
          </div>
          {product.sale_price && (
             <div className="text-gray-400 line-through text-lg mb-6">
               {product.price.toLocaleString('fr-FR')} FCFA
             </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-8 border-t border-b border-gray-100 py-6">
            {product.description}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-3 hover:bg-gray-50 text-gray-600"
              >
                <Minus size={18} />
              </button>
              <span className="px-4 font-bold w-12 text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-4 py-3 hover:bg-gray-50 text-gray-600"
              >
                <Plus size={18} />
              </button>
            </div>
            <button 
              onClick={() => addToCart(product, qty)}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-lg font-bold shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={20} /> Ajouter au panier
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
             <div className="flex items-center gap-2">
               <Truck size={18} className="text-brand-600" />
               Livraison Dschang: 1000 FCFA
             </div>
             <div className="flex items-center gap-2">
               <RefreshCw size={18} className="text-brand-600" />
               Retour sous 3 jours
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

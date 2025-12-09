import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const discountPercentage = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full overflow-hidden relative">
      {discountPercentage > 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
          -{discountPercentage}%
        </span>
      )}
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
         <button className="bg-white p-1.5 rounded-full shadow hover:text-brand-600 text-gray-500">
            <Heart size={16} />
         </button>
      </div>

      <Link to={`/product/${product.id}`} className="block relative pt-[100%] bg-gray-50">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="absolute top-0 left-0 w-full h-full object-cover mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-brand-600 h-10">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400">
             {[...Array(5)].map((_, i) => (
               <Star key={i} size={12} fill={i < Math.round(product.rating_avg) ? "currentColor" : "none"} />
             ))}
          </div>
          <span className="text-xs text-gray-400">({product.rating_count})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-brand-700">
              {(product.sale_price || product.price).toLocaleString('fr-FR')} FCFA
            </span>
            {product.sale_price && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toLocaleString('fr-FR')}
              </span>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            className="w-full bg-gray-100 text-gray-800 py-2 rounded font-medium text-sm hover:bg-brand-600 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

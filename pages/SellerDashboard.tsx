import React, { useEffect, useState, useCallback } from 'react';
import { Package, ShoppingBag, DollarSign, Settings, Plus, BarChart3, Upload, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Store, Product } from '../types';
import { createProduct } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const SellerDashboard: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reusable function to fetch/refresh dashboard data
  const fetchDashboardData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Get Store
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', user.id)
      .single();
    
    setStore(storeData);

    // 2. Get Products if store exists
    if (storeData) {
      const { data: productData } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeData.id)
        .order('created_at', { ascending: false });
      
      setProducts(productData as any[] || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
         navigate('/auth');
         return;
      }
      // Initial fetch
      await fetchDashboardData();
    };

    init();
  }, [navigate, fetchDashboardData]);

  const handleCreateStore = async () => {
    const name = prompt("Entrez le nom de votre boutique:");
    if(!name) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if(!user) return;

    const { error } = await supabase.from('stores').insert({
      owner_id: user.id,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: 'Nouvelle boutique',
      is_verified: false
    });

    if(!error) {
        // Refresh data instead of reloading page
        await fetchDashboardData();
    }
    else alert('Erreur création boutique: ' + error.message);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    setSubmitting(true);

    try {
      const productPayload = {
        store_id: store.id,
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock),
        category: newProduct.category,
        slug: newProduct.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      };

      await createProduct(productPayload, file || undefined);
      setShowAddModal(false);
      
      // Reset form
      setNewProduct({
        title: '',
        description: '',
        price: '',
        category: '',
        stock: ''
      });
      setFile(null);

      // Refresh data instead of reloading page
      await fetchDashboardData();
    } catch (e: any) {
      alert('Erreur: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  if (!store) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-8 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Devenir Vendeur</h2>
        <p className="mb-6">Vous n'avez pas encore de boutique. Créez-en une pour commencer à vendre.</p>
        <button onClick={handleCreateStore} className="bg-brand-600 text-white px-6 py-2 rounded">Créer ma boutique</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 relative">
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold">Nouveau Produit</h3>
               <button onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium">Titre</label>
                 <input type="text" className="w-full border p-2 rounded" required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium">Description</label>
                 <textarea className="w-full border p-2 rounded" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium">Prix (FCFA)</label>
                    <input type="number" className="w-full border p-2 rounded" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium">Stock</label>
                    <input type="number" className="w-full border p-2 rounded" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium">Catégorie</label>
                 <select className="w-full border p-2 rounded" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                   <option value="">Sélectionner une catégorie</option>
                   <option value="Electronics">Électronique</option>
                   <option value="Fashion">Mode</option>
                   <option value="Home">Maison</option>
                   <option value="Beauty">Beauté</option>
                   <option value="Food">Alimentation</option>
                 </select>
               </div>
               <div>
                  <label className="block text-sm font-medium">Image Principale</label>
                  <input type="file" className="w-full" onChange={e => setFile(e.target.files?.[0] || null)} />
               </div>
               <button type="submit" disabled={submitting} className="w-full bg-brand-600 text-white py-2 rounded font-bold disabled:bg-gray-400">
                  {submitting ? 'Création...' : 'Publier le produit'}
               </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-100 p-6 hidden md:block">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-bold">
             {store.name.substring(0,2).toUpperCase()}
           </div>
           <div>
             <div className="font-bold text-sm">{store.name}</div>
             <div className="text-xs text-gray-500">{store.is_verified ? 'Vérifié' : 'En attente'}</div>
           </div>
        </div>
        
        <nav className="space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-brand-50 text-brand-700 rounded-lg font-medium">
            <BarChart3 size={18} /> Vue d'ensemble
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            <Package size={18} /> Produits
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            <ShoppingBag size={18} /> Commandes
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">
            <DollarSign size={18} /> Portefeuille
          </a>
        </nav>
      </div>

      {/* Main Area */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-brand-700"
          >
            <Plus size={16} /> Nouveau Produit
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="text-gray-500 text-sm mb-1">Produits en ligne</div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="text-gray-500 text-sm mb-1">Commission</div>
             <div className="text-2xl font-bold text-gray-900">{store.commission_rate}%</div>
          </div>
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Vos produits</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Produit</th>
                  <th className="px-6 py-4 font-medium">Prix</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500">Aucun produit trouvé.</td></tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {product.images && product.images[0] && (
                            <img src={product.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-gray-100" />
                          )}
                          <span className="font-medium text-gray-900 line-clamp-1">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.price.toLocaleString()} FCFA</td>
                      <td className="px-6 py-4">{product.stock_quantity}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
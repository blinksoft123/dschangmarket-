import { Product, Store } from '../types';

export const MOCK_STORES: Store[] = [
  {
    id: 's1',
    owner_id: 'u2',
    name: 'Tech Cameroun',
    slug: 'tech-cameroun',
    description: 'Best electronics in Dschang',
    is_verified: true,
    commission_rate: 5,
    logo_url: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: 's2',
    owner_id: 'u3',
    name: 'Mode & Beauté',
    slug: 'mode-beaute',
    description: 'Traditional and modern fashion',
    is_verified: false,
    commission_rate: 5,
    logo_url: 'https://picsum.photos/100/100?random=2'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    store_id: 's1',
    store_name: 'Tech Cameroun',
    title: 'Smartphone Infinix Note 30 Pro',
    slug: 'infinix-note-30-pro',
    description: 'Un incroyable téléphone avec charge rapide et écran AMOLED. Parfait pour les affaires.',
    price: 120000,
    sale_price: 115000,
    stock_quantity: 10,
    images: ['https://picsum.photos/400/400?random=10', 'https://picsum.photos/400/400?random=11'],
    category: 'Electronics',
    rating_avg: 4.5,
    rating_count: 23,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    store_id: 's2',
    store_name: 'Mode & Beauté',
    title: 'Robe Kabba Traditionnelle',
    slug: 'robe-kabba',
    description: 'Robe traditionnelle cousue main. Tissu 100% coton de qualité supérieure.',
    price: 15000,
    stock_quantity: 50,
    images: ['https://picsum.photos/400/400?random=20'],
    category: 'Fashion',
    rating_avg: 4.8,
    rating_count: 12,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    store_id: 's1',
    store_name: 'Tech Cameroun',
    title: 'Laptop HP 15" Core i5',
    slug: 'hp-laptop-15',
    description: 'Ordinateur portable puissant pour le travail et les études. 8GB RAM, 256GB SSD.',
    price: 250000,
    stock_quantity: 5,
    images: ['https://picsum.photos/400/400?random=30'],
    category: 'Computing',
    rating_avg: 4.0,
    rating_count: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    store_id: 's2',
    store_name: 'Mode & Beauté',
    title: 'Chaussures Cuir Homme',
    slug: 'shoes-leather',
    description: 'Fabriqué localement à Dschang. Cuir véritable.',
    price: 22000,
    sale_price: 18000,
    stock_quantity: 15,
    images: ['https://picsum.photos/400/400?random=40'],
    category: 'Fashion',
    rating_avg: 3.5,
    rating_count: 2,
    created_at: new Date().toISOString()
  }
];

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  is_verified: boolean;
  commission_rate: number;
}

export interface Product {
  id: string;
  store_id: string;
  store_name?: string; // Joined field
  title: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  images: string[];
  category: string;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: 'mtn_momo' | 'orange_money' | 'cash_on_delivery';
  shipping_address: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_title: string;
  quantity: number;
  price: number;
}

export interface MobileMoneyResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

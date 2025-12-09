import { supabase } from '../lib/supabaseClient';
import { Product, Store, Order, CartItem } from '../types';

// --- PRODUCTS ---

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        stores (
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getProducts error:', JSON.stringify(error, null, 2));
      return [];
    }

    if (!data) return [];

    // Flatten the response to match Product interface
    return data.map((item: any) => ({
      ...item,
      store_name: item.stores?.name || 'Vendeur Inconnu'
    }));
  } catch (err: any) {
    console.error('Unexpected error in getProducts:', err.message || err);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        stores (
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase getProductById error:', JSON.stringify(error, null, 2));
      return null;
    }

    return {
      ...data,
      store_name: data.stores?.name
    };
  } catch (err) {
    console.error('Unexpected error in getProductById:', err);
    return null;
  }
};

export const createProduct = async (productData: Partial<Product>, file?: File): Promise<Product | null> => {
  let imageUrls = productData.images || [];

  // Handle Image Upload
  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', JSON.stringify(uploadError, null, 2));
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    imageUrls.push(data.publicUrl);
  }

  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData, images: imageUrls }])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', JSON.stringify(error, null, 2));
    throw error;
  }
  return data;
};

// --- STORES ---

export const getStoreByOwner = async (ownerId: string): Promise<Store | null> => {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', ownerId)
    .single();
  
  if (error) {
    // Code 'PGRST116' means 0 rows found, which is normal for new users
    if (error.code !== 'PGRST116') {
        console.error('Error fetching store:', JSON.stringify(error, null, 2));
    }
    return null;
  }
  return data;
};

// --- ORDERS ---

export const createOrder = async (
  userId: string | null,
  cartItems: CartItem[],
  totalAmount: number,
  shippingAddress: string,
  paymentMethod: string,
  paymentRef: string
) => {
  // 1. Create Order
  // Note: user_id can be null for guest checkout if your schema allows it.
  // If your schema enforces not null on user_id, ensure user is logged in.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount: totalAmount,
      status: 'paid', // Assuming payment gateway success
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      payment_ref: paymentRef
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', JSON.stringify(orderError, null, 2));
    throw new Error(orderError.message);
  }

  // 2. Create Order Items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    store_id: item.product.store_id, // Ensure this column exists in DB
    quantity: item.quantity,
    price: item.product.sale_price || item.product.price, // Mapped to 'price' column in DB
    product_title: item.product.title
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
     console.error('Error creating order items:', JSON.stringify(itemsError, null, 2));
     throw new Error(itemsError.message);
  }

  return order;
};
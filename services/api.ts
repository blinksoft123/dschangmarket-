import { supabase } from '../lib/supabaseClient';
import { Product, Store, Order, CartItem } from '../types';

// --- PRODUCTS ---

export const getProducts = async (): Promise<Product[]> => {
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
    // Stringify the error to see the full details in console instead of [object Object]
    console.error('Error fetching products:', JSON.stringify(error, null, 2));
    return [];
  }

  if (!data) return [];

  // Flatten the response to match Product interface
  return data.map((item: any) => ({
    ...item,
    store_name: item.stores?.name || 'Vendeur Inconnu'
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
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
    console.error('Error fetching product by ID:', JSON.stringify(error, null, 2));
    return null;
  }

  return {
    ...data,
    store_name: data.stores?.name
  };
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
      console.error('Error uploading image:', uploadError.message);
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
    // It's common to not have a store, so we don't always log as error unless it's a technical issue
    if (error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
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
    throw orderError;
  }

  // 2. Create Order Items
  const orderItems = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    store_id: item.product.store_id,
    quantity: item.quantity,
    price_at_purchase: item.product.sale_price || item.product.price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
     console.error('Error creating order items:', JSON.stringify(itemsError, null, 2));
     throw itemsError;
  }

  return order;
};
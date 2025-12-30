import { supabase } from './supabase.js';
import { currentUser } from './auth.js';
import { allProducts } from './products.js';

export let cartItems = [];

export async function loadCart() {
  if (!currentUser) {
    cartItems = [];
    return [];
  }

  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', currentUser.id);

  if (error) {
    console.error('Error loading cart:', error);
    cartItems = [];
  } else {
    cartItems = data || [];
  }

  return cartItems;
}

export async function addToCart(productId, quantity = 1) {
  if (!currentUser) {
    throw new Error('Please sign in to add items to cart');
  }

  const existing = cartItems.find(item => item.product_id === productId);

  if (existing) {
    return updateCartItem(existing.id, existing.quantity + quantity);
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        user_id: currentUser.id,
        product_id: productId,
        quantity
      }])
      .select()
      .single();

    if (error) throw error;
    cartItems.push(data);
    return data;
  }
}

export async function updateCartItem(cartItemId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single();

  if (error) throw error;

  const index = cartItems.findIndex(item => item.id === cartItemId);
  if (index !== -1) {
    cartItems[index] = data;
  }

  return data;
}

export async function removeFromCart(cartItemId) {
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId);

  if (error) throw error;

  cartItems = cartItems.filter(item => item.id !== cartItemId);
}

export async function clearCart() {
  if (!currentUser) return;

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', currentUser.id);

  if (error) throw error;

  cartItems = [];
}

export function getCartTotal() {
  return cartItems.reduce((total, item) => {
    const product = allProducts.find(p => p.id === item.product_id);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
}

export function getCartCount() {
  return cartItems.length;
}

export function getCartItemsWithProducts() {
  return cartItems.map(item => {
    const product = allProducts.find(p => p.id === item.product_id);
    return {
      ...item,
      product
    };
  });
}

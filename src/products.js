import { supabase } from './supabase.js';

const sampleProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 450,
    rating: 4.8,
    reviews_count: 234,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    badge: 'Best Seller',
    seller_id: 'seed-seller-1'
  },
  {
    id: '2',
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    price: 890,
    rating: 4.9,
    reviews_count: 189,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    badge: 'New',
    seller_id: 'seed-seller-1'
  },
  {
    id: '3',
    name: 'Premium Leather Jacket',
    category: 'Fashion',
    price: 1200,
    rating: 4.7,
    reviews_count: 156,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    badge: 'Hot Deal',
    seller_id: 'seed-seller-2'
  },
  {
    id: '4',
    name: 'iPhone 14 Pro Max',
    category: 'Phones',
    price: 15500,
    rating: 4.9,
    reviews_count: 423,
    image_url: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop',
    badge: 'Popular',
    seller_id: 'seed-seller-3'
  },
  {
    id: '5',
    name: 'Modern Sofa Set',
    category: 'Home & Furniture',
    price: 3500,
    rating: 4.6,
    reviews_count: 98,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    badge: '',
    seller_id: 'seed-seller-4'
  },
  {
    id: '6',
    name: 'Professional DSLR Camera',
    category: 'Electronics',
    price: 4200,
    rating: 4.8,
    reviews_count: 167,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
    badge: 'Premium',
    seller_id: 'seed-seller-5'
  },
  {
    id: '7',
    name: 'Designer Handbag',
    category: 'Fashion',
    price: 780,
    rating: 4.7,
    reviews_count: 201,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
    badge: 'Trending',
    seller_id: 'seed-seller-2'
  },
  {
    id: '8',
    name: 'Samsung Galaxy S23',
    category: 'Phones',
    price: 12800,
    rating: 4.8,
    reviews_count: 312,
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
    badge: '',
    seller_id: 'seed-seller-3'
  }
];

export let allProducts = [];

export async function loadProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading products:', error);
    allProducts = sampleProducts;
  } else if (data && data.length > 0) {
    allProducts = data;
  } else {
    allProducts = sampleProducts;
  }

  return allProducts;
}

export function getProductsByCategory(category) {
  return allProducts.filter(product =>
    product.category.toLowerCase() === category.toLowerCase()
  );
}

export function searchProducts(query) {
  const q = query.toLowerCase();
  return allProducts.filter(product =>
    product.name.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q)
  );
}

export async function getSellerProducts(sellerId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading seller products:', error);
    return [];
  }

  return data || [];
}

export async function addProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  allProducts.push(data);
  return data;
}

export async function updateProduct(productId, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;

  const index = allProducts.findIndex(p => p.id === productId);
  if (index !== -1) {
    allProducts[index] = data;
  }

  return data;
}

export async function deleteProduct(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;

  allProducts = allProducts.filter(p => p.id !== productId);
}

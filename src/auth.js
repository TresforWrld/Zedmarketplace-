import { supabase } from './supabase.js';

export let currentUser = null;

export async function initAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  updateAuthUI();

  supabase.auth.onAuthStateChange((event, session) => {
    (async () => {
      if (session?.user) {
        currentUser = session.user;
        await ensureProfile(session.user);
      } else {
        currentUser = null;
      }
      updateAuthUI();
    })();
  });
}

async function ensureProfile(user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from('profiles').insert([
      {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
      }
    ]);
  }
}

export async function signUp(email, password, fullName) {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  currentUser = null;
  updateAuthUI();
}

export async function getUserProfile() {
  if (!currentUser) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  return data;
}

export async function updateSellerStatus(isSeller, sellerName) {
  if (!currentUser) return null;

  const { data } = await supabase
    .from('profiles')
    .update({ is_seller: isSeller, seller_name: sellerName })
    .eq('id', currentUser.id)
    .select()
    .single();

  return data;
}

function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userIcon = document.getElementById('userIcon');
  const dashboardLink = document.getElementById('dashboardLink');
  const sellLink = document.getElementById('sellLink');

  if (currentUser) {
    loginBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
    userIcon.classList.remove('hidden');
    sellLink.classList.remove('hidden');
  } else {
    loginBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
    userIcon.classList.add('hidden');
    sellLink.classList.add('hidden');
  }

  getUserProfile().then(profile => {
    if (profile?.is_seller) {
      dashboardLink.classList.remove('hidden');
    } else {
      dashboardLink.classList.add('hidden');
    }
  });
}

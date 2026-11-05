import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, Order, OrderStatus, TrackingMilestone, User } from '../types';
import { INITIAL_PRODUCTS } from './products';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-ref')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = (): boolean => {
  return supabase !== null;
};

// Local storage storage keys
const LOCAL_STORAGE_ORDERS_KEY = 'aura_orders_store_v1';
const LOCAL_STORAGE_PRODUCTS_KEY = 'aura_products_store_v1';
const LOCAL_STORAGE_USER_KEY = 'aura_auth_user_v1';

export const DEMO_USER: User = {
  id: 'usr-9281',
  email: 'eleanor.vance@studio.design',
  fullName: 'Eleanor Vance',
  phone: '+1 (555) 234-8910',
  defaultShippingAddress: {
    fullName: 'Eleanor Vance',
    email: 'eleanor.vance@studio.design',
    phone: '+1 (555) 234-8910',
    street: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97201',
    country: 'United States'
  },
  createdAt: '2026-01-15T10:00:00.000Z'
};

// Seed demo orders for immediate rich experience
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ORD-89210',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3.5).toISOString(),
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@studio.design',
    customerPhone: '+1 (555) 234-8910',
    shippingAddress: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.vance@studio.design',
      phone: '+1 (555) 234-8910',
      street: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 2
      }
    ],
    subtotal: 445,
    discount: 44.5,
    shippingFee: 0,
    tax: 32.04,
    total: 432.54,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'out_for_delivery',
    trackingCarrier: 'Aura Express Courier',
    trackingNumber: 'AURA-EXP-99214-PDX',
    estimatedDeliveryDate: new Date(Date.now() + 3600 * 1000 * 1.5).toISOString(),
    driver: {
      name: 'Marcus Chen',
      phone: '+1 (555) 891-2401',
      vehicle: 'Zero-Emission Mercedes eVito (Plate: 8XYZ21)',
      rating: 4.96,
      currentMilestone: 'Approaching Hawthorne Blvd district',
      estimatedArrivalMinutes: 24
    },
    trackingMilestones: [
      {
        id: 'ms-1',
        status: 'confirmed',
        title: 'Order Confirmed & Payment Verified',
        description: 'Payment authorized via Stripe Secure Gateway.',
        location: 'Aura Central Processing Facility',
        timestamp: new Date(Date.now() - 3600 * 1000 * 3.5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        id: 'ms-2',
        status: 'processing',
        title: 'Quality Inspected & Custom Packaged',
        description: 'Items double-boxed in recyclable acoustic foam packaging.',
        location: 'Portland Metro Logistics Hub',
        timestamp: new Date(Date.now() - 3600 * 1000 * 2.2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        id: 'ms-3',
        status: 'shipped',
        title: 'Dispatched to Local Distribution Center',
        description: 'Arrived at sorting facility and assigned to courier route.',
        location: 'Northwest Dispatch Facility #09',
        timestamp: new Date(Date.now() - 3600 * 1000 * 1.1).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true
      },
      {
        id: 'ms-4',
        status: 'out_for_delivery',
        title: 'Courier Out for Final Mile Delivery',
        description: 'Driver Marcus Chen is currently 4 stops away from your doorstep.',
        location: 'On Route: SW 4th Ave Corridor',
        timestamp: new Date(Date.now() - 600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true
      },
      {
        id: 'ms-5',
        status: 'delivered',
        title: 'Package Delivered to Recipient',
        description: 'Handed directly or secured at residential entrance.',
        location: 'Delivery Address',
        timestamp: 'Estimated ~' + new Date(Date.now() + 1800 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: false
      }
    ]
  },
  {
    id: 'ORD-76341',
    createdAt: new Date(Date.now() - 86400 * 1000 * 4).toISOString(),
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor.vance@studio.design',
    customerPhone: '+1 (555) 234-8910',
    shippingAddress: {
      fullName: 'Eleanor Vance',
      email: 'eleanor.vance@studio.design',
      phone: '+1 (555) 234-8910',
      street: '742 Evergreen Terrace',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'United States'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1
      }
    ],
    subtotal: 495,
    discount: 0,
    shippingFee: 0,
    tax: 39.6,
    total: 534.6,
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingCarrier: 'Aura Express Courier',
    trackingNumber: 'AURA-EXP-87110-PDX',
    estimatedDeliveryDate: new Date(Date.now() - 86400 * 1000 * 2).toISOString(),
    driver: {
      name: 'Sarah Jenkins',
      phone: '+1 (555) 672-1192',
      vehicle: 'Aura Electric Van (Plate: 4TRK88)',
      rating: 4.98,
      currentMilestone: 'Completed delivery',
      estimatedArrivalMinutes: 0
    },
    trackingMilestones: [
      {
        id: 'ms-1',
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Payment authorized.',
        location: 'Aura Central Processing Facility',
        timestamp: 'Nov 01, 10:14 AM',
        completed: true
      },
      {
        id: 'ms-2',
        status: 'processing',
        title: 'Custom Packed',
        description: 'Inspected and certified.',
        location: 'Logistics Center',
        timestamp: 'Nov 01, 01:30 PM',
        completed: true
      },
      {
        id: 'ms-3',
        status: 'shipped',
        title: 'In Transit',
        description: 'Dispatched on courier manifest.',
        location: 'Regional Hub',
        timestamp: 'Nov 02, 08:45 AM',
        completed: true
      },
      {
        id: 'ms-4',
        status: 'out_for_delivery',
        title: 'Out for Delivery',
        description: 'Courier en route.',
        location: 'Portland Metro',
        timestamp: 'Nov 02, 11:20 AM',
        completed: true
      },
      {
        id: 'ms-5',
        status: 'delivered',
        title: 'Delivered - Signed by Resident',
        description: 'Package delivered safely inside front doorway.',
        location: '742 Evergreen Terrace',
        timestamp: 'Nov 02, 01:15 PM',
        completed: true,
        current: true
      }
    ]
  }
];

// Helper to get local stored items
const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ORDERS;
  }
};

const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to localStorage', e);
  }
};

// Data access operations with Supabase + Fallback
export async function getProducts(): Promise<Product[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          category: item.category,
          price: Number(item.price),
          compareAtPrice: item.compare_at_price ? Number(item.compare_at_price) : undefined,
          stockQuantity: item.stock_quantity,
          rating: Number(item.rating || 5.0),
          reviewsCount: item.reviews_count || 0,
          description: item.description,
          features: Array.isArray(item.features) ? item.features : [],
          materials: item.materials,
          dimensions: item.dimensions,
          imageUrl: item.image_url,
          badge: item.badge,
          isFeatured: item.is_featured
        }));
      }
    } catch (e) {
      console.warn('Supabase query error, fallback to local products', e);
    }
  }

  // Fallback to local products
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_PRODUCTS;
}

export async function getOrders(): Promise<Order[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseOrderToModel);
      }
    } catch (e) {
      console.warn('Supabase orders fetch error, fallback to local', e);
    }
  }
  return getStoredOrders();
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const normalizedId = orderId.trim().toUpperCase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', normalizedId)
        .single();
      if (!error && data) {
        return mapSupabaseOrderToModel(data);
      }
    } catch (e) {
      console.warn('Supabase single order fetch error', e);
    }
  }

  const localOrders = getStoredOrders();
  return localOrders.find(o => o.id.toUpperCase() === normalizedId) || null;
}

export async function createOrder(order: Order): Promise<Order> {
  if (supabase) {
    try {
      await supabase.from('orders').insert({
        id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        shipping_address: order.shippingAddress,
        items: order.items,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping_fee: order.shippingFee,
        tax: order.tax,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        order_status: order.orderStatus,
        tracking_carrier: order.trackingCarrier,
        tracking_number: order.trackingNumber,
        estimated_delivery_date: order.estimatedDeliveryDate,
        driver: order.driver,
        tracking_milestones: order.trackingMilestones,
        created_at: order.createdAt
      });
    } catch (e) {
      console.warn('Failed to insert order into Supabase, saving locally', e);
    }
  }

  // Always update local store for instant reactive UI
  const currentOrders = getStoredOrders();
  const updatedOrders = [order, ...currentOrders.filter(o => o.id !== order.id)];
  saveStoredOrders(updatedOrders);
  return order;
}

// Helper to advance delivery status for real-time order tracking simulation
export async function advanceOrderStatus(orderId: string): Promise<Order | null> {
  const orders = getStoredOrders();
  const target = orders.find(o => o.id === orderId);
  if (!target) return null;

  const sequence: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
  const currentIndex = sequence.indexOf(target.orderStatus);
  if (currentIndex === -1 || currentIndex >= sequence.length - 1) {
    return target; // already delivered
  }

  const nextStatus = sequence[currentIndex + 1];
  target.orderStatus = nextStatus;

  // Update milestones
  target.trackingMilestones = target.trackingMilestones.map((m) => {
    const milestoneIdx = sequence.indexOf(m.status);
    const nextIdx = sequence.indexOf(nextStatus);
    const isCompleted = milestoneIdx <= nextIdx;
    const isCurrent = milestoneIdx === nextIdx;
    return {
      ...m,
      completed: isCompleted,
      current: isCurrent,
      timestamp: isCurrent ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp
    };
  });

  if (nextStatus === 'delivered') {
    target.paymentStatus = 'paid';
    if (target.driver) {
      target.driver.estimatedArrivalMinutes = 0;
      target.driver.currentMilestone = 'Delivered safely to doorstep';
    }
  } else if (nextStatus === 'out_for_delivery') {
    if (!target.driver) {
      target.driver = {
        name: 'Jordan Miller',
        phone: '+1 (555) 723-9041',
        vehicle: 'Aura Electric Courier Van #14',
        rating: 4.95,
        currentMilestone: 'Within 2 miles of destination',
        estimatedArrivalMinutes: 12
      };
    } else {
      target.driver.estimatedArrivalMinutes = 12;
      target.driver.currentMilestone = 'En route to your street';
    }
  }

  saveStoredOrders(orders);

  // Sync to Supabase if connected
  if (supabase) {
    try {
      await supabase
        .from('orders')
        .update({
          order_status: target.orderStatus,
          payment_status: target.paymentStatus,
          driver: target.driver,
          tracking_milestones: target.trackingMilestones
        })
        .eq('id', target.id);
    } catch (e) {
      console.warn('Failed to update order status in Supabase', e);
    }
  }

  return target;
}

function mapSupabaseOrderToModel(data: any): Order {
  return {
    id: data.id,
    createdAt: data.created_at,
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    customerPhone: data.customer_phone,
    shippingAddress: data.shipping_address,
    items: data.items,
    subtotal: Number(data.subtotal),
    discount: Number(data.discount || 0),
    shippingFee: Number(data.shipping_fee || 0),
    tax: Number(data.tax || 0),
    total: Number(data.total),
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    orderStatus: data.order_status,
    trackingCarrier: data.tracking_carrier || 'Aura Express Courier',
    trackingNumber: data.tracking_number,
    estimatedDeliveryDate: data.estimated_delivery_date,
    driver: data.driver,
    trackingMilestones: Array.isArray(data.tracking_milestones) ? data.tracking_milestones : []
  };
}

// -------------------------------------------------------------
// Authentication Operations (Supabase Auth + High-Fidelity Local Fallback)
// -------------------------------------------------------------

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: User | null) {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to update auth storage', e);
  }
}

export async function signInUser(email: string, password: string):Promise<{ user: User | null; error: string | null }> {
  // Try Supabase Auth first if configured
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (data.user) {
        const authedUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          createdAt: data.user.created_at,
          defaultShippingAddress: data.user.user_metadata?.shipping_address,
        };
        saveStoredUser(authedUser);
        return { user: authedUser, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase auth sign in error, checking local store', err);
    }
  }

  // Local/demo fallback
  if (email.toLowerCase() === DEMO_USER.email.toLowerCase()) {
    saveStoredUser(DEMO_USER);
    return { user: DEMO_USER, error: null };
  }

  if (password.length >= 6) {
    const fallbackUser: User = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0].replace(/[._]/g, ' '),
      createdAt: new Date().toISOString(),
    };
    saveStoredUser(fallbackUser);
    return { user: fallbackUser, error: null };
  }

  return { user: null, error: 'Password must be at least 6 characters.' };
}

export async function signUpUser(fullName: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (error) {
        return { user: null, error: error.message };
      }
      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: fullName,
          createdAt: data.user.created_at,
        };
        saveStoredUser(newUser);
        return { user: newUser, error: null };
      }
    } catch (err: any) {
      console.warn('Supabase sign up error, fallback to local', err);
    }
  }

  if (password.length < 6) {
    return { user: null, error: 'Password must be at least 6 characters.' };
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    fullName,
    createdAt: new Date().toISOString(),
  };
  saveStoredUser(newUser);
  return { user: newUser, error: null };
}

export async function signOutUser(): Promise<void> {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error', e);
    }
  }
  saveStoredUser(null);
}

export function signInDemoUser(): User {
  saveStoredUser(DEMO_USER);
  return DEMO_USER;
}


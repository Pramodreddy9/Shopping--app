export type ProductCategory = 'All' | 'Audio' | 'Wearables' | 'Living' | 'Leather';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  materials?: string;
  dimensions?: string;
  imageUrl: string;
  badge?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingMilestone {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface CourierDriver {
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  currentMilestone: string;
  estimatedArrivalMinutes: number;
}

export type PaymentMethodType = 'card' | 'apple_pay' | 'google_pay' | 'cod';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'pending' | 'paid' | 'cod_pending';
  orderStatus: OrderStatus;
  trackingCarrier: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  driver?: CourierDriver;
  trackingMilestones: TrackingMilestone[];
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  freeShipping?: boolean;
  minAmount?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: 'navigate' | 'track_order' | 'view_product';
    payload: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  defaultShippingAddress?: ShippingAddress;
  createdAt: string;
}


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchApi } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  category?: any;
  gender?: string;
  material?: string;
  pattern?: string;
  fit?: string;
  image: string;
  images?: string[];
  galleryImages?: string[];
  description: string;
  detailsBullets?: string;
  careInstructions?: string;
  sizes?: string[];
  stock?: number;
  isNewArrival?: boolean;
  status?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: '1',
    name: 'Oversized Linen Shirt',
    price: 2499,
    originalPrice: 3499,
    badge: 'NEW ARRIVAL',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Men',
    category: 'Shirts',
    material: '100% European Flax Linen',
    fit: 'Oversized Fit',
    image: '/images/pdp_linen_main.jpg',
    images: ['/images/pdp_linen_main.jpg', '/images/prod_textured_shirt.jpg'],
    galleryImages: ['/images/pdp_linen_main.jpg', '/images/prod_textured_shirt.jpg'],
    description: 'Crafted from premium European flax linen for effortless breathability.',
    detailsBullets: '• Cuban Collar Design\n• Premium Breathable Weave\n• Side Pocket Utility',
    careInstructions: 'Machine wash cold with like colors.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 50,
  },
  {
    id: '2',
    name: 'Cargo Parachute Pants',
    price: 1899,
    originalPrice: 2899,
    badge: 'BESTSELLER',
    isNewArrival: false,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Bottoms',
    material: 'Cotton Blend',
    fit: 'Relaxed Fit',
    image: '/images/prod_cargo_pants.jpg',
    images: ['/images/prod_cargo_pants.jpg', '/images/cat_bottoms.jpg'],
    galleryImages: ['/images/prod_cargo_pants.jpg', '/images/cat_bottoms.jpg'],
    description: 'Relaxed fit technical cotton parachute trousers with utility side pockets.',
    detailsBullets: '• Adjustable Ankle Toggles\n• Elasticated Drawstring Waist\n• Deep Utility Pockets',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
  },
  {
    id: '3',
    name: 'Knitted Resort Polo',
    price: 1999,
    originalPrice: 2799,
    badge: 'LUXURY EDIT',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Men',
    category: 'Tops',
    material: 'Fine Knit Cotton',
    image: '/images/prod_knitted_polo.jpg',
    images: ['/images/prod_knitted_polo.jpg'],
    galleryImages: ['/images/prod_knitted_polo.jpg'],
    description: 'Breezy open-knit resort polo shirt with ribbed trim.',
    sizes: ['M', 'L', 'XL'],
    stock: 35,
  },
  {
    id: '4',
    name: 'Textured Casual Shirt',
    price: 1699,
    badge: 'NEW ARRIVAL',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Men',
    category: 'Shirts',
    material: 'Textured Cotton',
    image: '/images/prod_textured_shirt.jpg',
    images: ['/images/prod_textured_shirt.jpg'],
    galleryImages: ['/images/prod_textured_shirt.jpg'],
    description: 'Smart casual textured cotton button-down shirt with tailored collar.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60,
  },
  {
    id: '5',
    name: 'Silk Touch Slip Dress',
    price: 3299,
    originalPrice: 4299,
    badge: 'BESTSELLER',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Women',
    category: 'Dresses',
    material: 'Satin Silk',
    image: '/images/prod_slip_dress.jpg',
    images: ['/images/prod_slip_dress.jpg'],
    galleryImages: ['/images/prod_slip_dress.jpg'],
    description: 'Elegant floor-length satin silk slip dress designed for evening soirées.',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 25,
  },
  {
    id: '6',
    name: 'Linen Co-ord Set',
    price: 3499,
    originalPrice: 4999,
    badge: 'SUMMER EDIT',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Women',
    category: 'Sets',
    material: 'Pure Linen',
    image: '/images/prod_linen_set.jpg',
    images: ['/images/prod_linen_set.jpg'],
    galleryImages: ['/images/prod_linen_set.jpg'],
    description: '2-piece matching linen shirt and wide-leg trouser set.',
    sizes: ['S', 'M', 'L'],
    stock: 30,
  },
  {
    id: '7',
    name: 'Ribbed Contour Tank Top',
    price: 899,
    badge: 'ESSENTIAL',
    isNewArrival: false,
    status: 'PUBLISHED',
    gender: 'Women',
    category: 'Tops',
    material: 'Ribbed Cotton Stretch',
    image: '/images/prod_ribbed_tank.jpg',
    images: ['/images/prod_ribbed_tank.jpg'],
    galleryImages: ['/images/prod_ribbed_tank.jpg'],
    description: 'Form-fitting premium stretch ribbed tank top.',
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 80,
  },
  {
    id: '8',
    name: 'Heavyweight Oversized Tee',
    price: 999,
    originalPrice: 1499,
    badge: 'HOT',
    isNewArrival: false,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Tops',
    material: '240 GSM Organic Cotton',
    image: '/images/prod_oversized_tee.jpg',
    images: ['/images/prod_oversized_tee.jpg'],
    galleryImages: ['/images/prod_oversized_tee.jpg'],
    description: 'Heavyweight 240 GSM organic cotton boxy oversized t-shirt.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 100,
  },
];

export const getProductImage = (p: any): string => {
  if (!p) return '/images/pdp_linen_main.jpg';
  if (typeof p.productImage === 'string' && p.productImage.trim()) return p.productImage;
  if (typeof p.image === 'string' && p.image.trim()) return p.image;
  if (Array.isArray(p.images) && p.images[0]) return p.images[0];
  if (Array.isArray(p.galleryImages) && p.galleryImages[0]) return p.galleryImages[0];
  
  const name = (p.productName || p.name || '').toLowerCase();
  if (name.includes('parachute') || name.includes('pants') || name.includes('cargo')) return '/images/prod_cargo_pants.jpg';
  if (name.includes('tee') || name.includes('t-shirt') || name.includes('oversized')) return '/images/prod_oversized_tee.jpg';
  if (name.includes('tank') || name.includes('ribbed')) return '/images/prod_ribbed_tank.jpg';
  if (name.includes('dress') || name.includes('slip')) return '/images/prod_slip_dress.jpg';
  if (name.includes('polo') || name.includes('knitted')) return '/images/prod_knitted_polo.jpg';
  if (name.includes('set') || name.includes('co-ord') || name.includes('linen')) return '/images/prod_linen_set.jpg';

  return '/images/pdp_linen_main.jpg';
};

export interface AppliedCoupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  description?: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  isCartDrawerOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastItem[];
  themeSettings: Record<string, string>;
  appliedCoupon: AppliedCoupon | null;
  couponDiscount: number;
  couponError: string | null;

  // Actions
  addToCart: (product: Product, size?: string, quantity?: number, color?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCartDrawer: () => void;
  toggleWishlist: (productId: string) => void;
  setQuickViewProduct: (product: Product | null) => void;
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  setThemeSettings: (settings: Record<string, string>) => void;
  applyCoupon: (code: string, subtotal: number) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      isCartDrawerOpen: false,
      quickViewProduct: null,
      toasts: [],
      themeSettings: {},
      appliedCoupon: null,
      couponDiscount: 0,
      couponError: null,

      addToCart: (product, size = 'M', quantity = 1, color = 'Default') =>
        set((state) => {
          const cartItemId = `${product.id}-${size}-${color}`;
          const existingIndex = state.cart.findIndex((item) => item.id === cartItemId);

          let updatedCart = [...state.cart];
          if (existingIndex > -1) {
            updatedCart[existingIndex].quantity += quantity;
          } else {
            updatedCart.push({ id: cartItemId, product, quantity, size, color });
          }

          return {
            cart: updatedCart,
            isCartDrawerOpen: true,
            toasts: [
              ...state.toasts,
              {
                id: Date.now().toString(),
                title: 'Added to Bag',
                message: `${product.name} (${size}) has been added to your shopping cart.`,
              },
            ],
          };
        }),

      removeFromCart: (cartItemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.id === cartItemId) {
              return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
          }),
        })),

      clearCart: () => set({ cart: [], appliedCoupon: null, couponDiscount: 0, couponError: null }),

      toggleCartDrawer: () =>
        set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

      toggleWishlist: (productId) =>
        set((state) => {
          const exists = state.wishlist.includes(productId);
          const updated = exists
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId];

          return {
            wishlist: updated,
            toasts: [
              ...state.toasts,
              {
                id: Date.now().toString(),
                title: exists ? 'Removed from Wishlist' : 'Saved to Wishlist',
                message: exists
                  ? 'Item removed from your favorites.'
                  : 'Item saved to your favorites.',
              },
            ],
          };
        }),

      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      addToast: (title, message, type = 'success') =>
        set((state) => ({
          toasts: [...state.toasts, { id: Date.now().toString(), title, message, type }],
        })),

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setThemeSettings: (settings) => set({ themeSettings: settings }),

      applyCoupon: async (code: string, subtotal: number) => {
        try {
          set({ couponError: null });
          const data = await fetchApi('/coupons/validate', {
            method: 'POST',
            body: JSON.stringify({ code, subtotal }),
          });
          if (data && data.valid) {
            set((state) => ({
              appliedCoupon: data.coupon,
              couponDiscount: data.discountAmount,
              couponError: null,
              toasts: [
                ...state.toasts,
                {
                  id: Date.now().toString(),
                  title: 'Coupon Applied 🎉',
                  message: data.message,
                  type: 'success',
                },
              ],
            }));
            return { success: true, message: data.message };
          } else {
            const errMsg = data.error || 'Invalid coupon code';
            set({ couponError: errMsg });
            return { success: false, message: errMsg };
          }
        } catch (err: any) {
          const errMsg = err.message || 'Failed to validate coupon';
          set({ couponError: errMsg });
          return { success: false, message: errMsg };
        }
      },

      removeCoupon: () =>
        set((state) => ({
          appliedCoupon: null,
          couponDiscount: 0,
          couponError: null,
          toasts: [
            ...state.toasts,
            {
              id: Date.now().toString(),
              title: 'Coupon Removed',
              message: 'Promo code discount has been removed.',
              type: 'info',
            },
          ],
        })),
    }),
    {
      name: 'sanusha_store_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        appliedCoupon: state.appliedCoupon,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);

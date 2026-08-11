import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { fetchApi, getImageUrl } from '@/lib/api';

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
  rating?: number;
  reviewsCount?: number;
  shippingInfo?: string;
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
    name: 'Carved Wooden Lantern',
    price: 1899,
    originalPrice: 2499,
    badge: 'HANDCRAFTED',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Decor Accents',
    material: 'Mango Wood & Brass Glass',
    fit: '12" H x 6" W',
    image: '/images/prod_lantern_1.jpg',
    images: [
      '/images/prod_lantern_1.jpg',
      '/images/prod_lantern_2.jpg',
      '/images/prod_lantern_3.jpg',
      '/images/prod_lantern_4.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/cat_home_fragrance.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/cat_wall_art.jpg',
      '/images/prod_ceramic_vase_1.jpg',
    ],
    galleryImages: [
      '/images/prod_lantern_1.jpg',
      '/images/prod_lantern_2.jpg',
      '/images/prod_lantern_3.jpg',
      '/images/prod_lantern_4.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/cat_home_fragrance.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/cat_wall_art.jpg',
      '/images/prod_ceramic_vase_1.jpg',
    ],
    description: 'Hand-carved solid mango wood candle lantern featuring delicate geometric lattice work and brass accents.',
    detailsBullets: '• 100% Solid Mango Wood\n• Glass Cylinder Included\n• Brass Handle',
    careInstructions: 'Wipe clean with a soft dry cloth.',
    sizes: ['Small (8")', 'Medium (12")', 'Large (16")'],
    stock: 50,
  },
  {
    id: '2',
    name: 'Minimal Ceramic Vase',
    price: 999,
    originalPrice: 1499,
    badge: 'BESTSELLER',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Vases & Planters',
    material: 'Matte Ceramic Clay',
    fit: 'Standard (9")',
    image: '/images/prod_ceramic_vase_1.jpg',
    images: [
      '/images/prod_ceramic_vase_1.jpg',
      '/images/prod_vase_2.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/prod_lantern_1.jpg',
      '/images/prod_basket_1.jpg',
      '/images/cat_wall_art.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/prod_macrame_1.jpg',
      '/images/cat_home_fragrance.jpg',
    ],
    galleryImages: [
      '/images/prod_ceramic_vase_1.jpg',
      '/images/prod_vase_2.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/prod_lantern_1.jpg',
      '/images/prod_basket_1.jpg',
      '/images/cat_wall_art.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/prod_macrame_1.jpg',
      '/images/cat_home_fragrance.jpg',
    ],
    description: 'Handcrafted hollow donut ceramic vase with a stone-finish matte glaze.',
    detailsBullets: '• Terracotta Clay\n• Waterproof Interior\n• Weighted Base',
    careInstructions: 'Hand wash with mild soapy water.',
    sizes: ['Standard (9")', 'Tall (12")'],
    stock: 40,
  },
  {
    id: '3',
    name: 'Handwoven Storage Basket',
    price: 899,
    originalPrice: 1299,
    badge: 'ECO-FRIENDLY',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Storage & Baskets',
    material: 'Natural Seagrass & Leather',
    image: '/images/prod_basket_1.jpg',
    images: ['/images/prod_basket_1.jpg'],
    galleryImages: ['/images/prod_basket_1.jpg'],
    description: 'Handwoven seagrass basket with genuine leather carry handles.',
    sizes: ['Medium (12")', 'Large (15")'],
    stock: 35,
  },
  {
    id: '4',
    name: 'Macrame Wall Hanging',
    price: 1699,
    originalPrice: 2199,
    badge: 'HANDMADE',
    isNewArrival: true,
    status: 'PUBLISHED',
    gender: 'Unisex',
    category: 'Wall & Art',
    material: 'Recycled Cotton Cord',
    image: '/images/prod_macrame_1.jpg',
    images: ['/images/prod_macrame_1.jpg'],
    galleryImages: ['/images/prod_macrame_1.jpg'],
    description: 'Intricately hand-knotted macrame wall hanging tapestry attached to a solid teak wooden dowel.',
    sizes: ['Width 24" x Height 36"'],
    stock: 25,
  },
];

export const getProductImage = (p: any): string => {
  if (!p) return '/images/pdp_linen_main.jpg';
  let raw = '';
  if (typeof p.productImage === 'string' && p.productImage.trim()) raw = p.productImage;
  else if (typeof p.image === 'string' && p.image.trim()) raw = p.image;
  else if (Array.isArray(p.images) && p.images[0]) raw = p.images[0];
  else if (Array.isArray(p.galleryImages) && p.galleryImages[0]) raw = p.galleryImages[0];

  if (raw) return getImageUrl(raw);
  
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
          const currentWishlist = Array.isArray(state.wishlist) ? state.wishlist : [];
          const exists = currentWishlist.includes(productId);
          const updated = exists
            ? currentWishlist.filter((id) => id !== productId)
            : [...currentWishlist, productId];

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

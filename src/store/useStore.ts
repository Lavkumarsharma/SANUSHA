import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  rating?: number;
  reviewsCount?: number;
  image: string;
  galleryImages?: string[];
  badge?: string;
  category: string;
  gender: 'Women' | 'Men' | 'Unisex';
  sizeOptions: string[];
  colorHexes: string[];
  colors?: string[];
  material: string;
  pattern: string;
  description: string;
  detailsBulletPoints?: string[];
  careInstructions?: string;
  shippingInfo?: string;
}

export interface CompleteTheLookItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
}

interface AppStore {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  addToCart: (product: Product, size?: string, color?: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Search & Navigation Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGenders: string[];
  toggleGender: (gender: string) => void;
  selectedSizes: string[];
  toggleSize: (size: string) => void;
  selectedColors: string[];
  toggleColor: (color: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedMaterials: string[];
  toggleMaterial: (material: string) => void;
  selectedPatterns: string[];
  togglePattern: (pattern: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  resetFilters: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string) => void;
  removeToast: (id: string) => void;
}

export const COMPLETE_THE_LOOK_ITEMS: CompleteTheLookItem[] = [
  {
    id: 'ctl-1',
    name: 'Linen Relaxed Pants',
    price: 2199,
    image: '/images/prod_cargo_pants.jpg',
  },
  {
    id: 'ctl-2',
    name: 'Minimal Sneakers',
    price: 3199,
    image: '/images/cat_bottoms.jpg',
  },
  {
    id: 'ctl-3',
    name: 'Classic Watch',
    price: 4599,
    image: '/images/cat_men.jpg',
  },
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: '1',
    name: 'Carved Wooden Lantern',
    price: 1899,
    originalPrice: 2499,
    rating: 4.9,
    reviewsCount: 142,
    image: '/images/prod_lantern_1.jpg',
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
    badge: 'HANDCRAFTED',
    category: 'Decor Accents',
    gender: 'Unisex',
    sizeOptions: ['Small (8")', 'Medium (12")', 'Large (16")'],
    colorHexes: ['#5A3E2B', '#8C6D53', '#1F1F1F'],
    colors: ['Walnut Brown', 'Teak Wood', 'Antique Black'],
    material: 'Mango Wood & Brass Glass',
    pattern: 'Geometric Lattice',
    description:
      'Hand-carved solid mango wood candle lantern featuring delicate geometric lattice work and brass accents. Radiates a warm, ambient glow across living rooms and outdoor patios.',
    detailsBulletPoints: [
      '100% Solid Sustainably Sourced Mango Wood',
      'Hand-carved by Indian master artisans',
      'Removable glass tea light cylinder inside',
      'Brass handle for easy hanging or table placement',
      'Dimensions: 12" H x 6" W x 6" D',
      'Made in India',
    ],
    careInstructions:
      'Wipe clean with a dry soft microfiber cloth. Do not soak in water or use harsh chemical polishers.',
    shippingInfo:
      'Free standard delivery on orders above ₹999. Dispatch within 24 hours in shatter-proof eco packaging.',
  },
  {
    id: '2',
    name: 'Minimal Ceramic Vase',
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviewsCount: 118,
    image: '/images/prod_ceramic_vase_1.jpg',
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
    badge: 'BESTSELLER',
    category: 'Vases & Planters',
    gender: 'Unisex',
    sizeOptions: ['Standard (9")', 'Tall (12")'],
    colorHexes: ['#EAE5DC', '#D8C3A5', '#7A6B5D'],
    colors: ['Off-White', 'Warm Sand', 'Clay Grey'],
    material: 'Matte Ceramic Clay',
    pattern: 'Smooth Matte',
    description:
      'Handcrafted hollow donut ceramic vase with a stone-finish matte glaze. Perfectly holds pampas grass, eucalyptus, or dried botanical arrangements.',
    detailsBulletPoints: [
      'Hand-molded terracotta ceramic clay',
      'Waterproof sealed interior for fresh or dried flowers',
      'Minimalist Nordic & Japandi aesthetic',
      'Weighted base to prevent tipping',
      'Made in India',
    ],
    careInstructions:
      'Hand wash with mild soapy water. Air dry naturally.',
    shippingInfo:
      'Free shipping over ₹999. Shipped with extra bubble cushioning.',
  },
  {
    id: '3',
    name: 'Handwoven Storage Basket',
    price: 899,
    originalPrice: 1299,
    rating: 4.7,
    reviewsCount: 86,
    image: '/images/prod_basket_1.jpg',
    galleryImages: [
      '/images/prod_basket_1.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/prod_lantern_1.jpg',
      '/images/prod_ceramic_vase_1.jpg',
      '/images/prod_macrame_1.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/cat_home_fragrance.jpg',
      '/images/cat_wall_art.jpg',
      '/images/prod_lantern_3.jpg',
    ],
    badge: 'ECO-FRIENDLY',
    category: 'Storage & Baskets',
    gender: 'Unisex',
    sizeOptions: ['Medium (12")', 'Large (15")'],
    colorHexes: ['#D6C5B3', '#8C6D53'],
    colors: ['Natural Seagrass', 'Honey Jute'],
    material: 'Natural Seagrass & Leather',
    pattern: 'Woven Grid',
    description:
      'Handwoven seagrass basket with genuine leather carry handles. Ideal for organizing throw blankets, cushions, laundry, or indoor planters.',
    detailsBulletPoints: [
      '100% Natural Organic Seagrass Fibre',
      'Hand-stitched faux leather handles for durability',
      'Flexible and durable weave structure',
      'Multipurpose storage solution',
    ],
  },
  {
    id: '4',
    name: 'Macrame Wall Hanging',
    price: 1699,
    originalPrice: 2199,
    rating: 4.9,
    reviewsCount: 95,
    image: '/images/prod_macrame_1.jpg',
    galleryImages: [
      '/images/prod_macrame_1.jpg',
      '/images/cat_wall_art.jpg',
      '/images/decor_hero_banner.jpg',
      '/images/prod_ceramic_vase_1.jpg',
      '/images/prod_lantern_1.jpg',
      '/images/cat_textiles_cushions.jpg',
      '/images/cat_decor_accents.jpg',
      '/images/prod_basket_1.jpg',
      '/images/prod_lantern_2.jpg',
      '/images/cat_home_fragrance.jpg',
    ],
    badge: 'HANDMADE',
    category: 'Wall & Art',
    gender: 'Unisex',
    sizeOptions: ['Width 24" x Height 36"'],
    colorHexes: ['#F5F2EC', '#D9CEBE'],
    colors: ['Ivory Cream', 'Natural Raw Linen'],
    material: '100% Recycled Cotton Cord',
    pattern: 'Boho Knotwork',
    description:
      'Intricately hand-knotted macrame wall hanging tapestry attached to a solid teak wooden dowel. Brings warmth, texture, and bohemian chic into your bedroom or living space.',
    detailsBulletPoints: [
      'Pure organic cotton cord knots',
      'Natural polished wooden hanging rod included',
      'Ready to hang with sturdy top loop',
    ],
  },
];

// Default initial cart items matching reference screenshot (3 items)
const INITIAL_CART_ITEMS: CartItem[] = [
  {
    product: PRODUCTS_DATA[0], // Oversized Linen Shirt (₹2,499)
    quantity: 1,
    selectedSize: 'M',
    selectedColor: 'Sand Beige',
  },
  {
    product: PRODUCTS_DATA[8], // Cargo Parachute Pants (₹1,899)
    quantity: 1,
    selectedSize: 'M',
    selectedColor: 'Beige',
  },
  {
    product: PRODUCTS_DATA[9], // Minimal Sneakers (₹3,199)
    quantity: 1,
    selectedSize: '42',
    selectedColor: 'White',
  },
];

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      addToCart: (product, size = 'M', color = 'Default', qty = 1) => {
        const { cart, addToast } = get();
        const existingIndex = cart.findIndex(
          (item) => item.product.id === product.id && item.selectedSize === size
        );

        let updatedCart = [...cart];
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity += qty;
        } else {
          updatedCart.push({
            product,
            quantity: qty,
            selectedSize: size,
            selectedColor: color,
          });
        }

        set({ cart: updatedCart, isCartOpen: true });
        addToast('Added to Bag', `${product.name} (Qty ${qty}, Size ${size}) added to your shopping bag.`);
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, delta) => {
        set((state) => {
          const updated = state.cart
            .map((item) => {
              if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { cart: updated };
        });
      },

      clearCart: () => set({ cart: [] }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist, addToast } = get();
        const isSaved = wishlist.includes(productId);
        const updated = isSaved
          ? wishlist.filter((id) => id !== productId)
          : [...wishlist, productId];

        set({ wishlist: updated });
        if (!isSaved) {
          addToast('Saved to Wishlist', 'Item saved to your favorites.');
        }
      },

      // Filters State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: 'All Categories',
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      selectedGenders: [],
      toggleGender: (gender) =>
        set((state) => ({
          selectedGenders: state.selectedGenders.includes(gender)
            ? state.selectedGenders.filter((g) => g !== gender)
            : [...state.selectedGenders, gender],
        })),
      selectedSizes: [],
      toggleSize: (size) =>
        set((state) => ({
          selectedSizes: state.selectedSizes.includes(size)
            ? state.selectedSizes.filter((s) => s !== size)
            : [...state.selectedSizes, size],
        })),
      selectedColors: [],
      toggleColor: (color) =>
        set((state) => ({
          selectedColors: state.selectedColors.includes(color)
            ? state.selectedColors.filter((c) => c !== color)
            : [...state.selectedColors, color],
        })),
      priceRange: [899, 4999],
      setPriceRange: (range) => set({ priceRange: range }),
      selectedMaterials: [],
      toggleMaterial: (mat) =>
        set((state) => ({
          selectedMaterials: state.selectedMaterials.includes(mat)
            ? state.selectedMaterials.filter((m) => m !== mat)
            : [...state.selectedMaterials, mat],
        })),
      selectedPatterns: [],
      togglePattern: (pat) =>
        set((state) => ({
          selectedPatterns: state.selectedPatterns.includes(pat)
            ? state.selectedPatterns.filter((p) => p !== pat)
            : [...state.selectedPatterns, pat],
        })),
      sortBy: 'Featured',
      setSortBy: (sort) => set({ sortBy: sort }),

      resetFilters: () =>
        set({
          selectedCategory: 'All Categories',
          selectedGenders: [],
          selectedSizes: [],
          selectedColors: [],
          priceRange: [899, 4999],
          selectedMaterials: [],
          selectedPatterns: [],
          searchQuery: '',
        }),

      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),

      toasts: [],
      addToast: (title, message) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { id, title, message }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'sanusha_root_app_storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);

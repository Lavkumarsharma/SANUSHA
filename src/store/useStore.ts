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
    name: 'Oversized Linen Shirt',
    price: 2499,
    originalPrice: 3299,
    rating: 4.7,
    reviewsCount: 128,
    image: '/images/pdp_linen_main.jpg',
    galleryImages: [
      '/images/pdp_linen_main.jpg',
      '/images/prod_textured_shirt.jpg',
      '/images/hero_banner.jpg',
      '/images/summer_banner.jpg',
    ],
    badge: 'NEW ARRIVAL',
    category: 'Men',
    gender: 'Men',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colorHexes: ['#D6C5B3', '#FFFFFF', '#4A5844', '#1F1F1F'],
    colors: ['Sand Beige', 'White', 'Sage Green', 'Black'],
    material: '100% Linen',
    pattern: 'Solid',
    description:
      'Crafted from premium European flax linen, this oversized shirt offers breathability, comfort and a relaxed fit for effortless style.',
    detailsBulletPoints: [
      '100% Premium European Flax Linen',
      'Relaxed & Oversized Silhouette',
      'Spread collar with soft lining',
      'Front button closure with horn buttons',
      'Curved hemline for modern layering',
      'Made in India',
    ],
    careInstructions:
      'Machine wash cold gentle cycle with mild detergent. Do not bleach. Tumble dry low or line dry in shade.',
    shippingInfo:
      'Free standard delivery on orders above ₹999. Dispatch within 24 hours. Easy 7-day hassle-free returns.',
  },
  {
    id: '2',
    name: 'Linen Co-ord Set',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviewsCount: 94,
    image: '/images/prod_linen_set.jpg',
    galleryImages: [
      '/images/prod_linen_set.jpg',
      '/images/cat_women.jpg',
      '/images/hero_banner.jpg',
    ],
    badge: 'NEW ARRIVAL',
    category: 'Women',
    gender: 'Women',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL'],
    colorHexes: ['#D6C5B3', '#FFFFFF', '#E6DDD0'],
    colors: ['Sand Beige', 'White', 'Cream'],
    material: '100% Linen',
    pattern: 'Solid',
    description:
      'Crafted from 100% pure organic linen. Relaxed fit shirt paired with high-waisted wide leg trousers.',
  },
  {
    id: '3',
    name: 'Textured Shirt',
    price: 1699,
    originalPrice: 2299,
    rating: 4.8,
    reviewsCount: 76,
    image: '/images/prod_textured_shirt.jpg',
    badge: 'NEW ARRIVAL',
    category: 'Men',
    gender: 'Men',
    sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    colorHexes: ['#1F1F1F', '#5A4D41', '#EFECE6'],
    colors: ['Black', 'Brown', 'Cream'],
    material: 'Cotton',
    pattern: 'Textured',
    description:
      'Breathable textured woven shirt with Cuban collar design. Modern luxury essential.',
  },
  {
    id: '4',
    name: 'Ribbed Tank Top',
    price: 899,
    rating: 4.6,
    reviewsCount: 52,
    image: '/images/prod_ribbed_tank.jpg',
    category: 'Tops',
    gender: 'Women',
    sizeOptions: ['XS', 'S', 'M', 'L'],
    colorHexes: ['#1F1F1F', '#A6927D', '#EFECE6'],
    colors: ['Black', 'Taupe', 'White'],
    material: 'Cotton',
    pattern: 'Solid',
    description:
      'Ultra-soft stretch cotton ribbed racerback top. Contours elegantly.',
  },
  {
    id: '5',
    name: 'Oversized T-Shirt',
    price: 999,
    rating: 4.7,
    reviewsCount: 110,
    image: '/images/prod_oversized_tee.jpg',
    badge: 'NEW',
    category: 'Men',
    gender: 'Men',
    sizeOptions: ['S', 'M', 'L', 'XL', 'XXL'],
    colorHexes: ['#4E5340', '#1F1F1F', '#D8D4CA'],
    colors: ['Olive Green', 'Black', 'Off-White'],
    material: 'Cotton',
    pattern: 'Solid',
    description:
      'Heavyweight 240 GSM organic cotton boxy fit graphic tee. Premium drop-shoulder silhouette.',
  },
  {
    id: '6',
    name: 'Oversized Shirt',
    price: 1699,
    originalPrice: 1999,
    discountBadge: '-15%',
    rating: 4.5,
    reviewsCount: 41,
    image: '/images/cat_tops.jpg',
    category: 'Tops',
    gender: 'Women',
    sizeOptions: ['XS', 'S', 'M', 'L', 'XL'],
    colorHexes: ['#7A4B29', '#E6DDD0', '#1F1F1F'],
    colors: ['Brown', 'Beige', 'Black'],
    material: 'Cotton',
    pattern: 'Solid',
    description:
      'Casual oversized shirt in soft brushed cotton. Features dropped shoulders.',
  },
  {
    id: '7',
    name: 'Knitted Polo T-Shirt',
    price: 1299,
    rating: 4.8,
    reviewsCount: 88,
    image: '/images/prod_knitted_polo.jpg',
    badge: 'NEW',
    category: 'Men',
    gender: 'Men',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorHexes: ['#D6C5B3', '#1F1F1F', '#4A5844'],
    colors: ['Beige', 'Black', 'Olive'],
    material: 'Blend',
    pattern: 'Textured',
    description:
      'Fine-gauge knitted polo shirt with open collar styling. Lightweight, soft texture.',
  },
  {
    id: '8',
    name: 'Minimal Slip Dress',
    price: 1799,
    rating: 4.9,
    reviewsCount: 63,
    image: '/images/prod_slip_dress.jpg',
    category: 'Dresses',
    gender: 'Women',
    sizeOptions: ['XS', 'S', 'M', 'L'],
    colorHexes: ['#EFECE6', '#1F1F1F', '#2C3E35'],
    colors: ['Champagne', 'Black', 'Emerald'],
    material: 'Polyester',
    pattern: 'Solid',
    description:
      'Fluid satin midi slip dress with delicate thin straps and subtle side slit.',
  },
  {
    id: '9',
    name: 'Cargo Parachute Pants',
    price: 1899,
    rating: 4.7,
    reviewsCount: 79,
    image: '/images/prod_cargo_pants.jpg',
    category: 'Bottoms',
    gender: 'Unisex',
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colorHexes: ['#C5B99F', '#4A5844', '#1F1F1F'],
    colors: ['Khaki', 'Olive', 'Black'],
    material: 'Cotton',
    pattern: 'Solid',
    description:
      'Relaxed fit technical cotton parachute trousers with utility side pockets.',
  },
  {
    id: '10',
    name: 'Minimal Sneakers',
    price: 3199,
    rating: 4.9,
    reviewsCount: 56,
    image: '/images/cat_bottoms.jpg',
    category: 'Footwear',
    gender: 'Unisex',
    sizeOptions: ['40', '41', '42', '43', '44'],
    colorHexes: ['#FFFFFF', '#EFECE6'],
    colors: ['White', 'Off-White'],
    material: 'Leather',
    pattern: 'Solid',
    description: 'Clean minimalist white leather low-top sneakers with cushioned sole.',
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

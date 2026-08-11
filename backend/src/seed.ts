import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SANUSHA Enterprise Database Seeding...');

  // 1. Super Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sanusha.com' },
    update: {},
    create: {
      email: 'admin@sanusha.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin User created:', admin.email);

  // 2. Categories
  const decorAccentsCat = await prisma.category.upsert({
    where: { slug: 'decor-accents' },
    update: {
      name: 'Decor Accents',
      description: 'Artisan ceramic vases and candle lanterns',
      image: '/images/cat_decor_accents.jpg',
      isMegaMenu: true,
    },
    create: {
      name: 'Decor Accents',
      slug: 'decor-accents',
      description: 'Artisan ceramic vases and candle lanterns',
      image: '/images/cat_decor_accents.jpg',
      isMegaMenu: true,
    },
  });

  const vasesCat = await prisma.category.upsert({
    where: { slug: 'vases-planters' },
    update: {
      name: 'Vases & Planters',
      description: 'Handmolded terracotta and ceramic vases',
      image: '/images/prod_ceramic_vase_1.jpg',
      isMegaMenu: true,
    },
    create: {
      name: 'Vases & Planters',
      slug: 'vases-planters',
      description: 'Handmolded terracotta and ceramic vases',
      image: '/images/prod_ceramic_vase_1.jpg',
      isMegaMenu: true,
    },
  });

  const storageCat = await prisma.category.upsert({
    where: { slug: 'storage-baskets' },
    update: {
      name: 'Storage & Baskets',
      description: 'Handwoven natural seagrass baskets',
      image: '/images/prod_basket_1.jpg',
      isMegaMenu: true,
    },
    create: {
      name: 'Storage & Baskets',
      slug: 'storage-baskets',
      description: 'Handwoven natural seagrass baskets',
      image: '/images/prod_basket_1.jpg',
      isMegaMenu: true,
    },
  });

  const wallArtCat = await prisma.category.upsert({
    where: { slug: 'wall-art' },
    update: {
      name: 'Wall & Art',
      description: 'Boho macrame wall hangings and tapestries',
      image: '/images/cat_wall_art.jpg',
      isMegaMenu: true,
    },
    create: {
      name: 'Wall & Art',
      slug: 'wall-art',
      description: 'Boho macrame wall hangings and tapestries',
      image: '/images/cat_wall_art.jpg',
      isMegaMenu: true,
    },
  });

  // 3. Collections
  const homeCollection = await prisma.collection.upsert({
    where: { slug: 'home-decor-edit' },
    update: {
      title: "Artisan Living Edit",
      subtitle: 'HANDCRAFTED FOR BEAUTIFUL SPACES',
      image: '/images/decor_hero_banner.jpg',
      isFeatured: true,
      type: 'SEASONAL',
    },
    create: {
      title: "Artisan Living Edit",
      slug: 'home-decor-edit',
      subtitle: 'HANDCRAFTED FOR BEAUTIFUL SPACES',
      image: '/images/decor_hero_banner.jpg',
      isFeatured: true,
      type: 'SEASONAL',
    },
  });

  // 4. Products
  const productsData = [
    {
      name: 'Carved Wooden Lantern',
      slug: 'carved-wooden-lantern',
      sku: 'SAN-DECOR-001',
      price: 1899,
      originalPrice: 2499,
      badge: 'HANDCRAFTED',
      gender: 'Unisex',
      material: 'Mango Wood & Brass Glass',
      pattern: 'Geometric Lattice',
      description: 'Hand-carved solid mango wood candle lantern featuring delicate geometric lattice work and brass accents.',
      image: '/images/prod_lantern_1.jpg',
      galleryImages: JSON.stringify([
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
      ]),
      stock: 50,
      categoryId: decorAccentsCat.id,
      collectionId: homeCollection.id,
    },
    {
      name: 'Minimal Ceramic Vase',
      slug: 'minimal-ceramic-vase',
      sku: 'SAN-VASE-002',
      price: 999,
      originalPrice: 1499,
      badge: 'BESTSELLER',
      gender: 'Unisex',
      material: 'Matte Ceramic Clay',
      pattern: 'Smooth Matte',
      description: 'Handcrafted hollow donut ceramic vase with a stone-finish matte glaze.',
      image: '/images/prod_ceramic_vase_1.jpg',
      galleryImages: JSON.stringify([
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
      ]),
      stock: 40,
      categoryId: vasesCat.id,
      collectionId: homeCollection.id,
    },
    {
      name: 'Handwoven Storage Basket',
      slug: 'handwoven-storage-basket',
      sku: 'SAN-BASKET-003',
      price: 899,
      originalPrice: 1299,
      badge: 'ECO-FRIENDLY',
      gender: 'Unisex',
      material: 'Natural Seagrass & Leather',
      pattern: 'Woven Grid',
      description: 'Handwoven seagrass basket with genuine leather carry handles.',
      image: '/images/prod_basket_1.jpg',
      stock: 35,
      categoryId: storageCat.id,
    },
    {
      name: 'Macrame Wall Hanging',
      slug: 'macrame-wall-hanging',
      sku: 'SAN-[#MACRAME]-004',
      price: 1699,
      originalPrice: 2199,
      badge: 'HANDMADE',
      gender: 'Unisex',
      material: 'Recycled Cotton Cord',
      pattern: 'Boho Knotwork',
      description: 'Intricately hand-knotted macrame wall hanging tapestry attached to a solid teak wooden dowel.',
      image: '/images/prod_macrame_1.jpg',
      stock: 25,
      categoryId: wallArtCat.id,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log('✅ Home Decor Catalog Products created.');

  // 5. Initial Orders for Analytics
  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.upsert({
      where: { orderNumber: 'SN12345' },
      update: {},
      create: {
        orderNumber: 'SN12345',
        customerName: 'Law Kumar',
        email: 'lawkumar@gmail.com',
        phone: '+91 98765 43210',
        shippingAddress: '123, Green Park Extension, New Delhi 110016 India',
        subtotal: 7597,
        discount: 759,
        shippingFee: 0,
        total: 6838,
        status: 'DELIVERED',
        trackingNumber: 'AWB9876543210',
        items: {
          create: [
            {
              productId: firstProduct.id,
              productName: 'Oversized Linen Shirt',
              quantity: 1,
              price: 2499,
              size: 'M',
              color: 'Sand Beige',
            },
          ],
        },
      },
    });
    console.log('✅ Demo Order created.');
  }

  // 6. Theme Settings
  const themeDefaults = [
    { key: 'primaryColor', value: '#6C307D' },
    { key: 'primaryHoverColor', value: '#522061' },
    { key: 'backgroundColor', value: '#FFFFFF' },
    { key: 'fontTitle', value: 'Cormorant Garamond' },
    { key: 'fontBody', value: 'Plus Jakarta Sans' },
    { key: 'headerLayout', value: 'CENTER_LOGO' },
    { key: 'borderRadius', value: '4px' },
  ];

  for (const t of themeDefaults) {
    await prisma.themeSetting.upsert({
      where: { key: t.key },
      update: { value: t.value },
      create: t,
    });
  }

  // 7. CMS Sections
  const cmsDefaults = [
    {
      key: 'hero_slider',
      title: 'EFFORTLESSLY ELEGANT',
      subtitle: 'Timeless styles for every you. Designed to inspire confidence.',
      image: '/images/hero_banner.jpg',
      ctaText: 'SHOP NOW',
      ctaLink: '/shop',
      order: 1,
      isVisible: true,
    },
    {
      key: 'summer_banner',
      title: 'SIMPLIFY. ELEVATE. REPEAT.',
      subtitle: 'Modern essentials for your everyday moments.',
      image: '/images/summer_banner.jpg',
      ctaText: 'EXPLORE COLLECTION',
      ctaLink: '/shop',
      order: 2,
      isVisible: true,
    },
    {
      key: 'announcement_bar',
      title: '🚚 FREE SHIPPING ON ORDERS OVER ₹999 | 🔄 EASY RETURNS | 💳 COD AVAILABLE',
      order: 0,
      isVisible: true,
    },
  ];

  for (const c of cmsDefaults) {
    await prisma.cmsSection.upsert({
      where: { key: c.key },
      update: c,
      create: c,
    });
  }

  console.log('🎉 SANUSHA Enterprise Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

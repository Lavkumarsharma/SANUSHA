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
  const womenCat = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      name: 'Women',
      slug: 'women',
      description: 'Luxury women fashion collection',
      image: '/images/cat_women.jpg',
      isMegaMenu: true,
    },
  });

  const menCat = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      name: 'Men',
      slug: 'men',
      description: 'Contemporary men fashion and shirts',
      image: '/images/cat_men.jpg',
      isMegaMenu: true,
    },
  });

  const topsCat = await prisma.category.upsert({
    where: { slug: 'tops' },
    update: {},
    create: {
      name: 'Tops',
      slug: 'tops',
      description: 'Ribbed tanks, tops and linen shirts',
      image: '/images/cat_tops.jpg',
      isMegaMenu: true,
    },
  });

  const bottomsCat = await prisma.category.upsert({
    where: { slug: 'bottoms' },
    update: {},
    create: {
      name: 'Bottoms',
      slug: 'bottoms',
      description: 'Cargo parachute pants and pleated trousers',
      image: '/images/cat_bottoms.jpg',
      isMegaMenu: true,
    },
  });

  // 3. Collections
  const summerCollection = await prisma.collection.upsert({
    where: { slug: 'summer-24-edit' },
    update: {},
    create: {
      title: "Summer '24 Edit",
      slug: 'summer-24-edit',
      subtitle: 'SIMPLIFY. ELEVATE. REPEAT.',
      image: '/images/summer_banner.jpg',
      isFeatured: true,
      type: 'SEASONAL',
    },
  });

  // 4. Products
  const productsData = [
    {
      name: 'Oversized Linen Shirt',
      slug: 'oversized-linen-shirt',
      sku: 'SAN-SHIRT-001',
      price: 2499,
      originalPrice: 3299,
      badge: 'NEW ARRIVAL',
      gender: 'Men',
      material: '100% Linen',
      pattern: 'Solid',
      description: 'Crafted from premium European flax linen, this oversized shirt offers breathability, comfort and a relaxed fit.',
      image: '/images/pdp_linen_main.jpg',
      galleryImages: JSON.stringify(['/images/pdp_linen_main.jpg', '/images/prod_textured_shirt.jpg', '/images/hero_banner.jpg']),
      stock: 45,
      categoryId: menCat.id,
      collectionId: summerCollection.id,
    },
    {
      name: 'Linen Co-ord Set',
      slug: 'linen-co-ord-set',
      sku: 'SAN-SET-002',
      price: 2499,
      originalPrice: 3499,
      badge: 'NEW ARRIVAL',
      gender: 'Women',
      material: '100% Linen',
      pattern: 'Solid',
      description: 'Crafted from 100% pure organic linen. Relaxed fit shirt paired with high-waisted wide leg trousers.',
      image: '/images/prod_linen_set.jpg',
      galleryImages: JSON.stringify(['/images/prod_linen_set.jpg', '/images/cat_women.jpg']),
      stock: 30,
      categoryId: womenCat.id,
      collectionId: summerCollection.id,
    },
    {
      name: 'Textured Shirt',
      slug: 'textured-shirt',
      sku: 'SAN-SHIRT-003',
      price: 1699,
      originalPrice: 2299,
      badge: 'NEW ARRIVAL',
      gender: 'Men',
      material: 'Cotton',
      pattern: 'Textured',
      description: 'Breathable textured woven shirt with Cuban collar design.',
      image: '/images/prod_textured_shirt.jpg',
      stock: 60,
      categoryId: menCat.id,
    },
    {
      name: 'Ribbed Tank Top',
      slug: 'ribbed-tank-top',
      sku: 'SAN-TOP-004',
      price: 899,
      gender: 'Women',
      material: 'Cotton',
      pattern: 'Solid',
      description: 'Ultra-soft stretch cotton ribbed racerback top.',
      image: '/images/prod_ribbed_tank.jpg',
      stock: 80,
      categoryId: topsCat.id,
    },
    {
      name: 'Oversized T-Shirt',
      slug: 'oversized-t-shirt',
      sku: 'SAN-TEE-005',
      price: 999,
      badge: 'NEW',
      gender: 'Men',
      material: 'Cotton',
      pattern: 'Solid',
      description: 'Heavyweight 240 GSM organic cotton boxy fit graphic tee.',
      image: '/images/prod_oversized_tee.jpg',
      stock: 75,
      categoryId: menCat.id,
    },
    {
      name: 'Cargo Parachute Pants',
      slug: 'cargo-parachute-pants',
      sku: 'SAN-PANT-006',
      price: 1899,
      gender: 'Unisex',
      material: 'Cotton',
      pattern: 'Solid',
      description: 'Relaxed fit technical cotton parachute trousers with utility side pockets.',
      image: '/images/prod_cargo_pants.jpg',
      stock: 40,
      categoryId: bottomsCat.id,
    },
  ];

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log('✅ Catalog Products created.');

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

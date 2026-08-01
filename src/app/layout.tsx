import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SANUSHA | Effortlessly Elegant Luxury Fashion",
  description:
    "Discover timeless fashion styles, linen co-ords, luxury tops, and modern clothing essentials at SANUSHA. Free Shipping on orders over ₹999. Easy 7-day returns.",
  keywords: [
    "SANUSHA",
    "Fashion",
    "Luxury Clothing",
    "Women Fashion",
    "Men Fashion",
    "Linen Co-ords",
    "Summer Collection",
    "India Fashion Brand",
  ],
  openGraph: {
    title: "SANUSHA | Effortlessly Elegant Luxury Fashion",
    description:
      "Timeless fashion, crafted with purpose. Designed to empower. Made to last.",
    url: "https://sanusha.com",
    siteName: "SANUSHA",
    images: [
      {
        url: "/images/hero_banner.jpg",
        width: 1200,
        height: 630,
        alt: "SANUSHA Luxury Fashion Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "SANUSHA",
    image: "https://sanusha.com/images/hero_banner.jpg",
    description:
      "Timeless fashion, crafted with purpose. Designed to empower. Made to last.",
    priceRange: "₹899 - ₹3499",
    telephone: "+91-9876543210",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#6C307D] selection:text-white">
        {children}
      </body>
    </html>
  );
}

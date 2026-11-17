import type { Product } from "../types";

export const initialProducts: Product[] = [
  {
    id: "p1", title: "Introduction to Algorithms", description: "A useful textbook for computer science students. Some highlighting, otherwise in good condition.",
    price: 420, category: "Books", condition: "Good",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=900",
    sellerName: "Thando M.", sellerId: "demo-seller-1", university: "University of Johannesburg", createdAt: "2026-11-10"
  },
  {
    id: "p2", title: "Wireless Headphones", description: "Comfortable wireless headphones with a clear sound and reliable battery life.",
    price: 650, category: "Electronics", condition: "Like new",
    image: "https://images.unsplash.com/photo-1508632480382-4a1a9f4a9c7d?w=900",
    sellerName: "Lerato K.", sellerId: "demo-seller-2", university: "University of Johannesburg", createdAt: "2026-11-09"
  },
  {
    id: "p3", title: "Study Desk Lamp", description: "Compact LED desk lamp with adjustable neck. Ideal for late-night study sessions.",
    price: 180, category: "Home & Living", condition: "Good",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900",
    sellerName: "Brian N.", sellerId: "demo-seller-3", university: "University of Pretoria", createdAt: "2026-11-08"
  },
  {
    id: "p4", title: "Campus Backpack", description: "Spacious everyday backpack with laptop compartment and multiple pockets.",
    price: 350, category: "Fashion", condition: "Like new",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900",
    sellerName: "Amara D.", sellerId: "demo-seller-4", university: "University of Johannesburg", createdAt: "2026-11-07"
  },
  {
    id: "p5", title: "Scientific Calculator", description: "Scientific calculator suitable for mathematics, engineering and science courses.",
    price: 260, category: "Electronics", condition: "Good",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=900",
    sellerName: "Sipho P.", sellerId: "demo-seller-5", university: "University of the Witwatersrand", createdAt: "2026-11-06"
  },
  {
    id: "p6", title: "Desk Organiser", description: "Keep your stationery and study space organised with this simple desk organiser.",
    price: 120, category: "Home & Living", condition: "New",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=900",
    sellerName: "Nadia R.", sellerId: "demo-seller-6", university: "University of Johannesburg", createdAt: "2026-11-05"
  }
];

export const categories = ["All", "Books", "Electronics", "Fashion", "Home & Living", "Services"];

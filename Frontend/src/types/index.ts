export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  university: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: "New" | "Like new" | "Good" | "Fair";
  image: string;
  sellerName: string;
  sellerId: string;
  university: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

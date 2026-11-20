import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product, User } from "../types";
import { initialProducts } from "../data/products";

interface AppContextValue {
  products: Product[];
  user: User | null;
  cart: CartItem[];
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: User["role"], university: string) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, "id" | "sellerId" | "sellerName" | "createdAt">) => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);
const PRODUCTS_KEY = "campustree_products";
const USER_KEY = "campustree_user";
const CART_KEY = "campustree_cart";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => readStorage(PRODUCTS_KEY, initialProducts));
  const [user, setUser] = useState<User | null>(() => readStorage(USER_KEY, null));
  const [cart, setCart] = useState<CartItem[]>(() => readStorage(CART_KEY, []));

  useEffect(() => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)), [products]);
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);
  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  const login = (email: string, password: string) => {
    // Demo-only login. Replace this with POST /api/auth/login when the backend is ready.
    const accounts = readStorage<Array<{ user: User; password: string }>>("campustree_accounts", []);
    const account = accounts.find(item => item.user.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (account) {
      setUser(account.user);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string, role: User["role"], university: string) => {
    const accounts = readStorage<Array<{ user: User; password: string }>>("campustree_accounts", []);
    if (accounts.some(item => item.user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const newUser: User = { id: crypto.randomUUID(), name, email, role, university };
    localStorage.setItem("campustree_accounts", JSON.stringify([...accounts, { user: newUser, password }]));
    setUser(newUser);
  };

  const logout = () => setUser(null);

  const addProduct = (details: Omit<Product, "id" | "sellerId" | "sellerName" | "createdAt">) => {
    if (!user) return;
    const newProduct: Product = {
      ...details, id: crypto.randomUUID(), sellerId: user.id, sellerName: user.name,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setProducts(current => [newProduct, ...current]);
  };

  const addToCart = (product: Product) => {
    setCart(current => {
      const existing = current.find(item => item.product.id === product.id);
      return existing
        ? current.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(current => current.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => setCart(current => current.filter(item => item.product.id !== productId));

  const value = useMemo(() => ({
    products, user, cart, login, register, logout, addProduct, addToCart, updateQuantity, removeFromCart
  }), [products, user, cart]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}

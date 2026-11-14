"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@/utils/types/product";
import { apiRequest } from "@/services/api";

export interface CartLine {
  _id?: string;
  count: number;
  price: number;
  product: Product;
}

interface CartData {
  _id: string;
  products: CartLine[];
  totalCartPrice?: number;
  numOfCartItems?: number;
}

interface StoreContextValue {
  cart: CartData | null;
  wishlist: Product[];
  cartCount: number;
  wishlistCount: number;
  cartLoading: boolean;
  wishlistLoading: boolean;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (productId: string, count?: number) => Promise<void>;
  updateCartItem: (productId: string, count: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function readCart(result: unknown): CartData | null {
  const response = result as { data?: CartData | { cart?: CartData } };
  if (!response.data) return null;
  if ("cart" in response.data && response.data.cart) return response.data.cart;
  return response.data as CartData;
}

function readWishlist(result: unknown): Product[] {
  const response = result as { data?: Product[] | { data?: Product[] } };
  if (Array.isArray(response.data)) return response.data;
  if (
    response.data &&
    "data" in response.data &&
    Array.isArray(response.data.data)
  ) {
    return response.data.data;
  }
  return [];
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const token = session?.user?.backendToken;
  const [cart, setCart] = useState<CartData | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    setCartLoading(true);
    try {
      const result = await apiRequest<unknown>("/cart", {
        token,
        version: "v2",
      });
      setCart(readCart(result));
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    setWishlistLoading(true);
    try {
      const result = await apiRequest<unknown>("/wishlist", { token });
      setWishlist(readWishlist(result));
    } finally {
      setWishlistLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status !== "authenticated" || !token) {
      setCart(null);
      setWishlist([]);
      return;
    }
    refreshCart().catch(() => setCart(null));
    refreshWishlist().catch(() => setWishlist([]));
  }, [refreshCart, refreshWishlist, status, token]);

  const addToCart = useCallback(
    async (productId: string, count = 1) => {
      if (!token) throw new Error("Please sign in to use your cart.");
      await apiRequest("/cart", {
        method: "POST",
        token,
        version: "v2",
        body: JSON.stringify({ productId }),
      });
      if (count > 1) {
        await apiRequest(`/cart/${productId}`, {
          method: "PUT",
          token,
          version: "v2",
          body: JSON.stringify({ count }),
        });
      }
      await refreshCart();
    },
    [refreshCart, token],
  );

  const updateCartItem = useCallback(
    async (productId: string, count: number) => {
      if (!token) throw new Error("Please sign in to use your cart.");
      if (count < 1) {
        await apiRequest(`/cart/${productId}`, {
          method: "DELETE",
          token,
          version: "v2",
        });
      } else {
        await apiRequest(`/cart/${productId}`, {
          method: "PUT",
          token,
          version: "v2",
          body: JSON.stringify({ count }),
        });
      }
      await refreshCart();
    },
    [refreshCart, token],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!token) throw new Error("Please sign in to use your cart.");
      await apiRequest(`/cart/${productId}`, {
        method: "DELETE",
        token,
        version: "v2",
      });
      await refreshCart();
    },
    [refreshCart, token],
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!token) throw new Error("Please sign in to use your wishlist.");
      const exists = wishlist.some((product) => product._id === productId);
      if (exists) {
        await apiRequest(`/wishlist/${productId}`, { method: "DELETE", token });
      } else {
        await apiRequest("/wishlist", {
          method: "POST",
          token,
          body: JSON.stringify({ productId }),
        });
      }
      await refreshWishlist();
    },
    [refreshWishlist, token, wishlist],
  );

  const cartCount =
    cart?.products?.reduce((total, line) => total + line.count, 0) ?? 0;
  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      cartLoading,
      wishlistLoading,
      wishlistCount: wishlist.length,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartItem,
      removeFromCart,
      toggleWishlist,
    }),
    [
      cart,
      wishlist,
      cartCount,
      cartLoading,
      wishlistLoading,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartItem,
      removeFromCart,
      toggleWishlist,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider.");
  return context;
}

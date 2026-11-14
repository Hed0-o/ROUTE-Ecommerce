"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import ProductCard from "@/app/components/products/ProductCard";
import { useStore } from "@/context/StoreContext";

export default function WishlistPage() {
  const { status } = useSession();
  const { wishlist, wishlistLoading } = useStore();

  if (status === "loading" || (status === "authenticated" && wishlistLoading))
    return (
      <main className="page-shell min-h-[55vh] py-12 text-sm text-gray-500">
        Loading your wishlist...
      </main>
    );
  if (status !== "authenticated")
    return (
      <main className="page-shell flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
          <Heart size={28} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">
          Sign in to view your wishlist
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Save your favorite products and find them here later.
        </p>
        <Link href="/login" className="btn-primary mt-5">
          Sign in
        </Link>
      </main>
    );

  return (
    <main className="min-h-[55vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>Wishlist
        </nav>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[#2563eb]">
              Your saved finds
            </p>
            <h1 className="mt-1 text-3xl font-bold">My wishlist</h1>
          </div>
          <p className="text-sm text-gray-500">{wishlist.length} items</p>
        </div>
        {wishlist.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white px-6 py-16 text-center">
            <Heart size={34} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Tap the heart on any product to save it here.
            </p>
            <Link href="/products" className="btn-primary mt-5">
              <ShoppingBag size={16} /> Explore products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/utils/types/product";
import { useStore } from "@/context/StoreContext";

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const isSaved = wishlist.some((item) => item._id === product._id);

  async function handleAction(action: () => Promise<void>, success: string) {
    setPending(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="group relative min-w-0 rounded-xl border border-gray-100 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4">
      <div className="relative">
        <Link
          href={`/products/${product._id}`}
          aria-label={`View ${product.title}`}
          className="block overflow-hidden rounded-lg bg-[#f7f8f8]"
        >
          <div className="aspect-square">
            <img
              src={product.imageCover}
              alt={product.title}
              className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
        <button
          type="button"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() =>
            handleAction(
              () => toggleWishlist(product._id),
              isSaved ? "Removed from wishlist" : "Saved to wishlist",
            )
          }
          disabled={pending}
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:text-red-500 ${isSaved ? "text-red-500" : "text-gray-400"}`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
        {product.priceAfterDiscount &&
          product.priceAfterDiscount < product.price && (
            <span className="absolute left-2 top-2 rounded bg-[#eff6ff] px-2 py-1 text-[10px] font-bold text-[#078307]">
              SALE
            </span>
          )}
      </div>
      <Link
        href={
          product.category?._id
            ? `/categories/${product.category._id}`
            : "/categories"
        }
        className="mt-4 block truncate text-xs text-gray-500 hover:text-[#2563eb]"
      >
        {product.category?.name || "General"}
      </Link>
      <Link href={`/products/${product._id}`} className="mt-1 block min-h-10">
        <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-[#21313c]">
          {product.title}
        </h2>
      </Link>
      <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
        <Star size={14} fill="currentColor" />
        <span className="font-medium text-gray-600">
          {product.ratingsAverage?.toFixed(1) ?? "—"}
        </span>
        <span className="text-gray-400">({product.ratingsQuantity ?? 0})</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-sm font-bold text-[#21313c]">
          {(product.priceAfterDiscount || product.price).toLocaleString(
            "en-US",
          )}{" "}
          <span className="text-[10px] font-medium text-gray-500">EGP</span>
          {product.priceAfterDiscount &&
            product.priceAfterDiscount < product.price && (
              <span className="ml-1 text-xs font-normal text-gray-400 line-through">
                {product.price}
              </span>
            )}
        </p>
        <button
          type="button"
          aria-label="Add to cart"
          onClick={() =>
            handleAction(() => addToCart(product._id), "Added to cart")
          }
          disabled={pending || product.quantity < 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[#1d4ed8] transition hover:bg-[#2563eb] hover:text-white disabled:opacity-50"
        >
          <ShoppingCart size={17} />
        </button>
      </div>
      {message && (
        <p aria-live="polite" className="mt-2 text-[11px] text-[#078307]">
          {message}{" "}
          {message.includes("sign in") && (
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
          )}
        </p>
      )}
    </article>
  );
}

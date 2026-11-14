"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { Product } from "@/utils/types/product";
import { useStore } from "@/context/StoreContext";

export default function ProductDetails({ product }: { product: Product }) {
  const [image, setImage] = useState(product.imageCover);
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const isSaved = wishlist.some((item) => item._id === product._id);
  const images = [product.imageCover, ...(product.images || [])];

  async function run(action: () => Promise<void>, success: string) {
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
    <main className="min-h-[60vh] bg-[#f7f8f8] py-7">
      <div className="page-shell">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#2563eb]">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#2563eb]">
            Products
          </Link>
          <span>/</span>
          <span className="line-clamp-1 text-[#21313c]">{product.title}</span>
        </nav>
        <Link
          href="/products"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#2563eb]"
        >
          <ArrowLeft size={16} /> Back to products
        </Link>
        <div className="grid gap-8 rounded-2xl bg-white p-4 shadow-sm sm:p-7 lg:grid-cols-2 lg:gap-12">
          <section>
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-[#f7f8f8] p-5">
              <img
                src={image}
                alt={product.title}
                className="h-full w-full object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  run(
                    () => toggleWishlist(product._id),
                    isSaved ? "Removed from wishlist" : "Saved to wishlist",
                  )
                }
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow ${isSaved ? "text-red-500" : "text-gray-400"}`}
                aria-label="Toggle wishlist"
              >
                <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((src, index) => (
                  <button
                    type="button"
                    key={`${src}-${index}`}
                    onClick={() => setImage(src)}
                    className={`aspect-square overflow-hidden rounded-lg border bg-[#f7f8f8] p-1 ${image === src ? "border-[#2563eb]" : "border-transparent"}`}
                  >
                    <img
                      src={src}
                      alt={`${product.title} image ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
          <section className="flex flex-col py-2">
            <Link
              href={
                product.brand?._id ? `/brands/${product.brand._id}` : "/brands"
              }
              className="w-fit text-sm font-medium text-[#2563eb]"
            >
              {product.brand?.name || "UrbanNest selection"}
            </Link>
            <h1 className="mt-2 text-2xl font-bold leading-tight text-[#21313c] sm:text-3xl">
              {product.title}
            </h1>
            <div className="mt-3 flex items-center gap-1.5 text-sm">
              <Star size={16} fill="currentColor" className="text-amber-400" />
              <span className="font-semibold">
                {product.ratingsAverage?.toFixed(1) ?? "—"}
              </span>
            </div>
            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-[#21313c]">
                {(product.priceAfterDiscount || product.price).toLocaleString(
                  "en-US",
                )}{" "}
                <span className="text-sm font-medium text-gray-500">EGP</span>
              </p>
              {product.priceAfterDiscount &&
                product.priceAfterDiscount < product.price && (
                  <p className="text-sm text-gray-400 line-through">
                    {product.price.toLocaleString("en-US")} EGP
                  </p>
                )}
            </div>
            <div className="my-6 border-t border-gray-100" />
            <p className="text-sm leading-7 text-gray-600">
              {product.description}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-[#f7f8f8] p-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <Link
                  href={
                    product.category?._id
                      ? `/categories/${product.category._id}`
                      : "/categories"
                  }
                  className="mt-1 inline-block font-medium hover:text-[#2563eb]"
                >
                  {product.category?.name || "General"}
                </Link>
              </div>
              <div>
                <p className="text-xs text-gray-500">Availability</p>
                <p
                  className={`mt-1 font-medium ${product.quantity > 0 ? "text-[#078307]" : "text-red-500"}`}
                >
                  {product.quantity > 0
                    ? `${product.quantity} in stock`
                    : "Out of stock"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex h-11 items-center rounded-lg border border-gray-200">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setCount((value) => Math.max(1, value - 1))}
                  className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-[#2563eb]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {count}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() =>
                    setCount((value) =>
                      Math.min(Math.max(1, product.quantity), value + 1),
                    )
                  }
                  className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-[#2563eb]"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  run(() => addToCart(product._id, count), "Added to cart")
                }
                disabled={pending || product.quantity < 1}
                className="btn-primary min-w-48 flex-1"
              >
                <ShoppingCart size={18} /> Add to cart
              </button>
            </div>
            {message && (
              <p aria-live="polite" className="mt-3 text-sm text-[#078307]">
                {message}{" "}
                {message.includes("sign in") && (
                  <Link href="/login" className="font-semibold underline">
                    Sign in
                  </Link>
                )}
              </p>
            )}
            <div className="mt-6 border-t border-gray-100 pt-5 text-sm text-gray-500">
              <p>✓ Secure checkout</p>
              <p className="mt-2">✓ Cash and card payment available</p>
            </div>
          </section>
        </div>
        <section className="mt-8 rounded-xl bg-white p-6">
          <h2 className="text-lg font-bold">Product details</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-600">
            {product.description}
          </p>
        </section>
      </div>
    </main>
  );
}

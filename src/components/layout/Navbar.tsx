"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Heart, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
];

function CountBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#2563eb] px-1 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount, wishlistCount } = useStore();
  const links = session
    ? [...navLinks, { label: "Orders", href: "/orders" }]
    : navLinks;

  return (
    <header className="relative z-40 bg-white">
      <div className="bg-[#f1f5f9] text-xs text-[#59656b]">
        <div className="page-shell flex min-h-9 items-center justify-between gap-4">
          <p>Home · Men's and women's fashion · Electronics</p>
        </div>
      </div>
      <div className="page-shell flex min-h-[82px] items-center gap-4">
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-[25px] font-bold tracking-[-1.5px] text-[#21313c]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-white">
            U
          </span>
          UrbanNest
        </Link>
        <form
          action="/products"
          className="mx-auto hidden w-full max-w-[470px] md:block"
        >
          <label className="flex h-11 items-center gap-2 rounded-lg border border-gray-200 px-3 text-gray-400 focus-within:border-[#2563eb]">
            <Search size={18} />
            <input
              name="keyword"
              placeholder="Search for products..."
              className="w-full bg-transparent text-sm text-[#21313c] outline-none"
            />
            <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </label>
        </form>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#5c6c75] hover:bg-gray-50 hover:text-[#2563eb]"
          >
            <Heart size={20} />
            <CountBadge count={wishlistCount} />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#5c6c75] hover:bg-gray-50 hover:text-[#2563eb]"
          >
            <ShoppingCart size={21} />
            <CountBadge count={cartCount} />
          </Link>
          {session ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/change-password"
                className="flex h-10 items-center gap-2 rounded-lg px-2 text-sm hover:bg-gray-50"
              >
                <UserRound size={18} />
                <span className="max-w-24 truncate">
                  {session.user?.name || "Account"}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-[#2563eb]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm hover:border-[#2563eb]"
              >
                <UserRound size={17} /> Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#2563eb] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="border-y border-gray-100">
        <nav className="page-shell hidden h-12 items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#52616a] transition hover:text-[#2563eb]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      {menuOpen && (
        <nav className="absolute inset-x-0 top-full border-t border-gray-100 bg-white px-5 py-3 shadow-lg md:hidden">
          {[
            ...links,
            ...(session
              ? [{ label: "My account", href: "/change-password" }]
              : [
                  { label: "Sign in", href: "/login" },
                  { label: "Create account", href: "/register" },
                ]),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block border-b border-gray-100 py-3 text-sm last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <form
            action="/products"
            className="mt-3 flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-gray-400"
          >
            <Search size={17} />
            <input
              name="keyword"
              placeholder="Search products..."
              className="w-full bg-transparent text-sm text-[#21313c] outline-none"
            />
          </form>
        </nav>
      )}
    </header>
  );
}

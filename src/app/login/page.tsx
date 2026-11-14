"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { signIn } from "next-auth/react";
import { ArrowRight, LockKeyhole, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Email or password is incorrect. Please try again.");
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Email or password is incorrect. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="page-shell grid min-h-[65vh] items-center gap-8 py-10 lg:grid-cols-2">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
          <LockKeyhole size={22} />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage your cart, favorites and orders.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium">
            Email address
            <input
              className="field mt-2"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              className="field mt-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              placeholder="Your password"
            />
          </label>
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#2563eb] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary w-full"
          >
            {pending ? "Signing in..." : "Sign in"}
            <ArrowRight size={17} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          New to UrbanNest?{" "}
          <Link href="/register" className="font-semibold text-[#2563eb]">
            Create an account
          </Link>
        </p>
      </div>
      <div
        className="hidden min-h-[390px] flex-col justify-end rounded-2xl bg-[#eff6ff] bg-cover bg-center p-10 text-white lg:flex"
        style={{
          backgroundImage:
            "linear-gradient(0deg,rgba(0,0,0,.6),rgba(0,0,0,.05)),url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80)",
        }}
      >
        <ShoppingBag size={30} />
        <h2 className="mt-5 text-3xl font-bold">Shopping made simple.</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
          Find everyday essentials from the brands you trust, all in one place.
        </p>
      </div>
    </main>
  );
}

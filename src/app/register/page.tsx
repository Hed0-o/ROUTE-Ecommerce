"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { apiRequest, getErrorMessage } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (form.password !== form.rePassword) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/login");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[65vh] items-center justify-center py-10">
      <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
          <UserRoundPlus size={22} />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Create your account</h1>
        <p className="mt-2 text-sm text-gray-500">
          Join UrbanNest for home finds, fashion and electronics in one place.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mt-7 grid gap-4 sm:grid-cols-2"
        >
          <label className="text-sm font-medium sm:col-span-2">
            Full name
            <input
              className="field mt-2"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              autoComplete="name"
              required
              minLength={3}
            />
          </label>
          <label className="text-sm font-medium">
            Email address
            <input
              className="field mt-2"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="text-sm font-medium">
            Phone number
            <input
              className="field mt-2"
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              autoComplete="tel"
              required
            />
          </label>
          <label className="text-sm font-medium">
            Password
            <input
              className="field mt-2"
              type="password"
              value={form.password}
              onChange={(event) => update("password", event.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          <label className="text-sm font-medium">
            Confirm password
            <input
              className="field mt-2"
              type="password"
              value={form.rePassword}
              onChange={(event) => update("rePassword", event.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="btn-primary mt-1 w-full sm:col-span-2"
          >
            {pending ? "Creating account..." : "Create account"}
            <ArrowRight size={17} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2563eb]">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

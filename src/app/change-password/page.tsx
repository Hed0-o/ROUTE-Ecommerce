"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ArrowRight, KeyRound } from "lucide-react";
import { apiRequest, getErrorMessage } from "@/services/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [router, status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== rePassword) {
      setError("The new passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await apiRequest("/auth/changeMyPassword", {
        method: "PUT",
        token: session?.user?.backendToken,
        body: JSON.stringify({ currentPassword, password, rePassword }),
      });
      await signOut({ callbackUrl: "/login" });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setPending(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[60vh] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
          <KeyRound size={22} />
        </div>
        <h1 className="mt-5 text-3xl font-bold">Change password</h1>
        <p className="mt-2 text-sm text-gray-500">
          Choose a strong password to keep your account secure.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <label className="block text-sm font-medium">
            Current password
            <input
              className="field mt-2"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <label className="block text-sm font-medium">
            New password
            <input
              className="field mt-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm new password
            <input
              className="field mt-2"
              type="password"
              value={rePassword}
              onChange={(event) => setRePassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
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
            disabled={pending || status === "loading"}
            className="btn-primary w-full"
          >
            {pending ? "Updating..." : "Update password"}
            <ArrowRight size={17} />
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/" className="font-semibold text-[#2563eb]">
            Back to shop
          </Link>
        </p>
      </div>
    </main>
  );
}

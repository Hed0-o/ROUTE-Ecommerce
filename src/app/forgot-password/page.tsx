"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { apiRequest, getErrorMessage } from "@/services/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (step === 3 && password !== rePassword) {
      setError("The passwords do not match.");
      return;
    }
    setPending(true);
    try {
      if (step === 1) {
        await apiRequest("/auth/forgotPasswords", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        setStep(2);
        setMessage("A reset code has been sent to your email.");
      } else if (step === 2) {
        await apiRequest("/auth/verifyResetCode", {
          method: "POST",
          body: JSON.stringify({ resetCode }),
        });
        setStep(3);
        setMessage("Code verified. Choose a new password.");
      } else {
        await apiRequest("/auth/resetPassword", {
          method: "PUT",
          body: JSON.stringify({ email, newPassword: password }),
        });
        setStep(4);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="page-shell flex min-h-[65vh] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
          <Mail size={22} />
        </div>
        {step === 4 ? (
          <>
            <h1 className="mt-5 text-3xl font-bold">Password updated</h1>
            <p className="mt-2 text-sm text-gray-500">
              Your password has been reset. Sign in with your new password.
            </p>
            <Link href="/login" className="btn-primary mt-6 w-full">
              Go to sign in <ArrowRight size={17} />
            </Link>
          </>
        ) : (
          <>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-[#2563eb]">
              Step {step} of 3
            </p>
            <h1 className="mt-2 text-3xl font-bold">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-500">
              {step === 1
                ? "Enter the email address connected to your account."
                : step === 2
                  ? "Enter the reset code sent to your email."
                  : "Create a new password for your account."}
            </p>
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {step === 1 && (
                <label className="block text-sm font-medium">
                  Email address
                  <input
                    className="field mt-2"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
              )}
              {step === 2 && (
                <label className="block text-sm font-medium">
                  Reset code
                  <input
                    className="field mt-2"
                    value={resetCode}
                    onChange={(event) => setResetCode(event.target.value)}
                    required
                    inputMode="numeric"
                  />
                </label>
              )}
              {step === 3 && (
                <>
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
                </>
              )}
              {message && (
                <p
                  role="status"
                  className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800"
                >
                  {message}
                </p>
              )}
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
                {pending
                  ? "Please wait..."
                  : step === 1
                    ? "Send reset code"
                    : step === 2
                      ? "Verify code"
                      : "Update password"}
                <ArrowRight size={17} />
              </button>
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep((value) => value - 1);
                    setError("");
                    setMessage("");
                  }}
                  className="flex w-full items-center justify-center gap-2 py-2 text-sm text-gray-500 hover:text-[#2563eb]"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
            </form>
          </>
        )}
        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-semibold text-[#2563eb]">
            Return to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

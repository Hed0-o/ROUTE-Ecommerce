"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { apiRequest, getErrorMessage } from "@/services/api";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { cart, cartLoading, updateCartItem, removeFromCart, refreshCart } =
    useStore();
  const [shipping, setShipping] = useState({
    details: "",
    phone: "",
    city: "",
  });
  const [payment, setPayment] = useState("cash");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const items = cart?.products || [];
  const subtotal =
    cart?.totalCartPrice ??
    items.reduce(
      (sum, line) => sum + (line.price || line.product.price) * line.count,
      0,
    );
  const shippingFee = 0;

  async function changeItem(productId: string, count: number) {
    setError("");
    try {
      await updateCartItem(productId, count);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deleteItem(productId: string) {
    setError("");
    try {
      await removeFromCart(productId);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!cart?._id || !items.length) {
      setError("Your cart is empty.");
      return;
    }
    setPending(true);
    try {
      if (payment === "cash") {
        await apiRequest(`/orders/${cart._id}`, {
          method: "POST",
          token: session?.user?.backendToken,
          body: JSON.stringify({ shippingAddress: shipping }),
        });
        await refreshCart();
        router.push("/orders?placed=1");
      } else {
        const query = new URLSearchParams({ url: window.location.origin });
        const checkoutPath = `/orders/checkout-session/${cart._id}?${query.toString()}`;
        let result: {
          session?: { url?: string };
          sessionUrl?: string;
          url?: string;
          data?: { session?: { url?: string } };
        };
        try {
          result = await apiRequest(checkoutPath, {
            method: "POST",
            token: session?.user?.backendToken,
          });
        } catch {
          result = await apiRequest(checkoutPath, {
            token: session?.user?.backendToken,
          });
        }
        const checkoutUrl =
          result.session?.url ||
          result.data?.session?.url ||
          result.sessionUrl ||
          result.url;
        if (!checkoutUrl)
          throw new Error(
            "Checkout link was not returned. Please try cash on delivery.",
          );
        window.location.assign(checkoutUrl);
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setPending(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && cartLoading))
    return (
      <main className="page-shell min-h-[55vh] py-12">
        <p className="text-sm text-gray-500">Loading your cart...</p>
      </main>
    );
  if (status !== "authenticated")
    return (
      <main className="page-shell flex min-h-[55vh] flex-col items-center justify-center py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb]">
          <ShoppingCart size={28} />
        </span>
        <h1 className="mt-5 text-2xl font-bold">Sign in to view your cart</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Your cart is connected to your account. Sign in to add items and check
          out.
        </p>
        <Link href="/login" className="btn-primary mt-5">
          Sign in <ArrowRight size={16} />
        </Link>
      </main>
    );

  return (
    <main className="min-h-[55vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>Shopping cart
        </nav>
        <h1 className="mb-6 text-3xl font-bold">
          Your cart{" "}
          <span className="text-lg font-normal text-gray-400">
            ({items.length} items)
          </span>
        </h1>
        {!items.length ? (
          <div className="rounded-xl bg-white px-6 py-16 text-center">
            <ShoppingCart size={34} className="mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-gray-500">
              Find something you love and add it to your cart.
            </p>
            <Link href="/products" className="btn-primary mt-5">
              Start shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
            <section className="space-y-3">
              {items.map((line) => (
                <article
                  key={line.product._id}
                  className="flex gap-4 rounded-xl bg-white p-4"
                >
                  <Link
                    href={`/products/${line.product._id}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[#f7f8f8] p-2"
                  >
                    <img
                      src={line.product.imageCover}
                      alt={line.product.title}
                      className="h-full w-full object-contain"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${line.product._id}`}
                      className="line-clamp-2 text-sm font-semibold hover:text-[#2563eb]"
                    >
                      {line.product.title}
                    </Link>
                    <p className="mt-1 text-xs text-gray-500">
                      {line.product.brand?.name || "UrbanNest"}
                    </p>
                    <p className="mt-2 text-sm font-bold">
                      {(line.price || line.product.price).toLocaleString(
                        "en-US",
                      )}{" "}
                      EGP
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex h-8 items-center rounded-md border border-gray-200">
                        <button
                          type="button"
                          onClick={() =>
                            changeItem(
                              line.product._id,
                              Math.max(1, line.count - 1),
                            )
                          }
                          aria-label="Decrease quantity"
                          className="px-2 text-gray-500"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold">
                          {line.count}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            changeItem(line.product._id, line.count + 1)
                          }
                          aria-label="Increase quantity"
                          className="px-2 text-gray-500"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteItem(line.product._id)}
                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
            <form
              onSubmit={checkout}
              className="rounded-xl bg-white p-5 sm:p-6"
            >
              <h2 className="text-lg font-bold">Checkout</h2>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium">
                  Delivery address
                  <input
                    className="field mt-1.5"
                    value={shipping.details}
                    onChange={(event) =>
                      setShipping({ ...shipping, details: event.target.value })
                    }
                    placeholder="Street, building, apartment"
                    required
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm font-medium">
                    City
                    <input
                      className="field mt-1.5"
                      value={shipping.city}
                      onChange={(event) =>
                        setShipping({ ...shipping, city: event.target.value })
                      }
                      required
                    />
                  </label>
                  <label className="block text-sm font-medium">
                    Phone
                    <input
                      className="field mt-1.5"
                      type="tel"
                      value={shipping.phone}
                      onChange={(event) =>
                        setShipping({ ...shipping, phone: event.target.value })
                      }
                      required
                    />
                  </label>
                </div>
              </div>
              <fieldset className="mt-5">
                <legend className="text-sm font-semibold">
                  Payment method
                </legend>
                <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={payment === "cash"}
                    onChange={() => setPayment("cash")}
                    className="accent-[#2563eb]"
                  />
                  <span>
                    <span className="block font-medium">Cash on delivery</span>
                    <span className="text-xs text-gray-500">
                      Pay when your order arrives
                    </span>
                  </span>
                </label>
                <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                    className="accent-[#2563eb]"
                  />
                  <span>
                    <span className="block font-medium">Online payment</span>
                    <span className="text-xs text-gray-500">
                      Secure card checkout
                    </span>
                  </span>
                </label>
              </fieldset>
              <div className="my-5 border-t border-gray-100" />
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{subtotal.toLocaleString("en-US")} EGP</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span>{shippingFee ? `${shippingFee} EGP` : "Free"}</span>
                </p>
                <p className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>
                    {(subtotal + shippingFee).toLocaleString("en-US")} EGP
                  </span>
                </p>
              </div>
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="btn-primary mt-5 w-full"
              >
                {pending
                  ? "Processing..."
                  : payment === "cash"
                    ? "Place order"
                    : "Continue to payment"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

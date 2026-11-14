"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowRight, PackageCheck } from "lucide-react";
import { apiRequest, getErrorMessage } from "@/services/api";

interface OrderItem {
  count?: number;
  price?: number;
  product?: { _id?: string; title?: string; imageCover?: string };
}

interface Order {
  _id: string;
  createdAt?: string;
  totalOrderPrice?: number;
  totalPrice?: number;
  paymentMethodType?: string;
  isPaid?: boolean;
  isDelivered?: boolean;
  cartItems?: OrderItem[];
  products?: OrderItem[];
}

export default function OrdersList() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (
        status !== "authenticated" ||
        !session?.user?.id ||
        !session.user.backendToken
      ) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const result = await apiRequest<{ data?: Order[] }>(
          `/orders/user/${session.user.id}`,
          { token: session.user.backendToken },
        );
        setOrders(result.data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }
    if (status !== "loading") loadOrders();
  }, [session, status]);

  if (status === "loading" || loading)
    return (
      <div className="rounded-xl bg-white p-8 text-sm text-gray-500">
        Loading your orders...
      </div>
    );
  if (status !== "authenticated")
    return (
      <div className="rounded-xl bg-white px-6 py-14 text-center">
        <PackageCheck size={34} className="mx-auto text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold">
          Sign in to view your orders
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Your order history is available in your account.
        </p>
        <Link href="/login" className="btn-primary mt-5">
          Sign in <ArrowRight size={16} />
        </Link>
      </div>
    );
  if (error)
    return (
      <div
        role="alert"
        className="rounded-xl bg-amber-50 p-6 text-sm text-amber-800"
      >
        {error}
      </div>
    );
  if (!orders.length)
    return (
      <div className="rounded-xl bg-white px-6 py-14 text-center">
        <PackageCheck size={34} className="mx-auto text-gray-300" />
        <h2 className="mt-4 text-xl font-semibold">No orders yet</h2>
        <p className="mt-2 text-sm text-gray-500">
          When you place your first order, you will see it here.
        </p>
        <Link href="/products" className="btn-primary mt-5">
          Explore products <ArrowRight size={16} />
        </Link>
      </div>
    );

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const items = order.cartItems || order.products || [];
        const date = order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Recent order";
        return (
          <article
            key={order._id}
            className="rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500">Order placed {date}</p>
                <h2 className="mt-1 font-semibold">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h2>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${order.isDelivered ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}
              >
                {order.isDelivered ? "Delivered" : "Processing"}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {items.slice(0, 4).map((item, index) => (
                <div
                  key={`${item.product?._id || "item"}-${index}`}
                  className="flex items-center gap-2 rounded-lg bg-[#f7f8f8] p-2"
                >
                  <img
                    src={
                      item.product?.imageCover ||
                      "https://placehold.co/60x60?text=Item"
                    }
                    alt={item.product?.title || "Order item"}
                    className="h-12 w-12 rounded object-contain"
                  />
                  <div className="max-w-36">
                    <p className="line-clamp-2 text-xs font-medium">
                      {item.product?.title || "Product"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Qty {item.count || 1}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
              <p className="text-gray-500">
                {order.paymentMethodType || "Payment"} ·{" "}
                {order.isPaid ? "Paid" : "Payment due"}
              </p>
              <p className="font-bold">
                Total{" "}
                {(
                  order.totalOrderPrice ??
                  order.totalPrice ??
                  0
                ).toLocaleString("en-US")}{" "}
                EGP
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

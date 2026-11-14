import Link from "next/link";
import { Suspense } from "react";
import OrdersList from "@/app/components/orders/OrdersList";

type OrdersSearchParams = Promise<{ placed?: string }>;

export default function OrdersPage({
  searchParams,
}: {
  searchParams: OrdersSearchParams;
}) {
  return (
    <main className="min-h-[55vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>My orders
        </nav>
        <Suspense fallback={null}>
          <OrderPlacedNotice searchParams={searchParams} />
        </Suspense>
        <div className="mb-6">
          <p className="text-sm font-medium text-[#2563eb]">Your account</p>
          <h1 className="mt-1 text-3xl font-bold">Order history</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review your purchases and their delivery status.
          </p>
        </div>
        <OrdersList />
      </div>
    </main>
  );
}

async function OrderPlacedNotice({
  searchParams,
}: {
  searchParams: OrdersSearchParams;
}) {
  const params = await searchParams;
  if (params.placed !== "1") return null;

  return (
    <div
      role="status"
      className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
    >
      Your order was placed successfully.
    </div>
  );
}

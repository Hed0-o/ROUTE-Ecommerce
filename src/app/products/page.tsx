import Link from "next/link";
import { Suspense } from "react";
import ProductList from "@/app/components/products/ProductList";
import { getStorefrontProducts } from "@/services/product.service";
import type { Product } from "@/utils/types/product";

type ProductsSearchParams = Promise<{ keyword?: string | string[] }>;

export default function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] pb-12">
      <div className="page-shell">
        <nav className="py-5 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#2563eb]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#21313c]">All products</span>
        </nav>
        <div className="mb-7">
          <p className="text-sm font-medium text-[#2563eb]">
            Find something you love
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21313c] sm:text-4xl">
            All products
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Explore our complete product collection
          </p>
        </div>
        <Suspense fallback={<ProductsLoading />}>
          <ProductsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: ProductsSearchParams;
}) {
  const params = await searchParams;
  const keyword = Array.isArray(params.keyword)
    ? params.keyword[0] || ""
    : params.keyword || "";
  let products: Product[] = [];
  let loadError = false;

  try {
    const result = await getStorefrontProducts(keyword);
    products = result.data || [];
  } catch {
    loadError = true;
  }

  return (
    <>
      <p className="mb-4 text-right text-sm text-gray-500">
        {products.length} products
      </p>
      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-8 text-center">
          <h2 className="font-semibold text-amber-900">
            Products could not be loaded
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Check your connection and refresh the page.
          </p>
        </div>
      ) : (
        <ProductList products={products} initialKeyword={keyword} />
      )}
    </>
  );
}

function ProductsLoading() {
  return (
    <div className="animate-pulse" aria-label="Loading products">
      <div className="mb-6 flex h-14 items-center justify-between rounded-xl bg-white p-4">
        <div className="h-9 w-64 rounded-lg bg-gray-100" />
        <div className="h-9 w-40 rounded-lg bg-gray-100" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-100 bg-white p-3 sm:p-4"
          >
            <div className="aspect-square rounded-lg bg-gray-100" />
            <div className="mt-4 h-3 w-1/3 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-full rounded bg-gray-100" />
            <div className="mt-2 h-4 w-2/3 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

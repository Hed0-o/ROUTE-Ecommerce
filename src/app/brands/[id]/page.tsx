import Link from "next/link";
import { Suspense } from "react";
import ProductList from "@/app/components/products/ProductList";
import {
  getBrandById,
  getStorefrontProducts,
} from "@/services/product.service";

export default function BrandDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<BrandDetailsLoading />}>
      <BrandDetailsContent params={params} />
    </Suspense>
  );
}

async function BrandDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [brandResult, productResult] = await Promise.allSettled([
    getBrandById(id),
    getStorefrontProducts("", { brand: id }),
  ]);
  const brand = brandResult.status === "fulfilled" ? brandResult.value : null;
  let products =
    productResult.status === "fulfilled"
      ? (productResult.value.data || []).filter(
          (product) => product.brand?._id === id,
        )
      : [];
  if (!products.length) {
    try {
      products = (await getStorefrontProducts()).data.filter(
        (product) => product.brand?._id === id,
      );
    } catch {
      products = [];
    }
  }

  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/brands">Brands</Link>
          <span className="mx-2">/</span>
          <span className="text-[#21313c]">{brand?.name || "Brand"}</span>
        </nav>
        <div className="mb-7 flex flex-col items-center gap-4 rounded-xl bg-white px-6 py-8 text-center sm:flex-row sm:text-left">
          {brand?.image ? (
            <img
              src={brand.image}
              alt={brand.name}
              className="h-24 w-36 object-contain"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eff6ff] text-3xl font-bold text-[#2563eb]">
              {brand?.name?.slice(0, 1) || "B"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#2563eb]">
              Brand collection
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              {brand?.name || "Brand products"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Explore products from this brand.
            </p>
          </div>
        </div>
        {products.length ? (
          <ProductList products={products} />
        ) : (
          <div className="rounded-xl bg-white p-12 text-center">
            <p className="font-semibold">No products found for this brand</p>
            <Link
              href="/brands"
              className="mt-4 inline-block text-sm font-semibold text-[#2563eb]"
            >
              Browse other brands
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function BrandDetailsLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell animate-pulse">
        <div className="mb-5 h-4 w-56 rounded bg-gray-200" />
        <div className="mb-7 h-36 rounded-xl bg-white" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="aspect-[4/5] rounded-xl bg-white" />
          ))}
        </div>
      </div>
    </main>
  );
}

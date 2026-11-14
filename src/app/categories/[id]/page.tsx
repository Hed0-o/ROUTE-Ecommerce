import Link from "next/link";
import { Suspense } from "react";
import ProductList from "@/app/components/products/ProductList";
import {
  getCategoryById,
  getStorefrontProducts,
} from "@/services/product.service";

export default function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<CategoryDetailsLoading />}>
      <CategoryDetailsContent params={params} />
    </Suspense>
  );
}

async function CategoryDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categoryResult, productResult] = await Promise.allSettled([
    getCategoryById(id),
    getStorefrontProducts("", { category: id }),
  ]);
  const category =
    categoryResult.status === "fulfilled" ? categoryResult.value : null;
  let products =
    productResult.status === "fulfilled"
      ? (productResult.value.data || []).filter(
          (product) => product.category?._id === id,
        )
      : [];
  if (!products.length) {
    try {
      products = (await getStorefrontProducts()).data.filter(
        (product) => product.category?._id === id,
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
          <Link href="/categories">Categories</Link>
          <span className="mx-2">/</span>
          <span className="text-[#21313c]">
            {category?.name || "Collection"}
          </span>
        </nav>
        <div className="mb-7 overflow-hidden rounded-xl bg-white sm:flex">
          {category?.image && (
            <img
              src={category.image}
              alt={category.name}
              className="h-48 w-full object-cover sm:h-56 sm:w-1/3"
            />
          )}
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-9">
            <p className="text-sm font-medium text-[#2563eb]">
              Browse category
            </p>
            <h1 className="mt-1 text-3xl font-bold">
              {category?.name || "Category products"}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Discover products picked from this collection.
            </p>
          </div>
        </div>
        {products.length ? (
          <ProductList products={products} />
        ) : (
          <div className="rounded-xl bg-white p-12 text-center">
            <p className="font-semibold">No products in this category yet</p>
            <p className="mt-2 text-sm text-gray-500">
              Try another category to find what you need.
            </p>
            <Link
              href="/categories"
              className="mt-4 inline-block text-sm font-semibold text-[#2563eb]"
            >
              Browse categories
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

function CategoryDetailsLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell animate-pulse">
        <div className="mb-5 h-4 w-56 rounded bg-gray-200" />
        <div className="mb-7 h-48 rounded-xl bg-white" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="aspect-[4/5] rounded-xl bg-white" />
          ))}
        </div>
      </div>
    </main>
  );
}

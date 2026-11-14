import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  filterCategoriesWithProducts,
  getCategories,
  getStorefrontProducts,
  type CatalogItem,
} from "@/services/product.service";

export default async function CategoriesPage() {
  let categories: CatalogItem[] = [];
  let failed = false;
  try {
    const [categoryResult, productResult] = await Promise.all([
      getCategories(),
      getStorefrontProducts(),
    ]);
    categories = filterCategoriesWithProducts(
      categoryResult.data || [],
      productResult.data || [],
    );
  } catch {
    failed = true;
  }

  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#21313c]">Categories</span>
        </nav>
        <div className="mb-7">
          <p className="text-sm font-medium text-[#2563eb]">
            Find your next favorite
          </p>
          <h1 className="mt-1 text-3xl font-bold">Shop by category</h1>
          <p className="mt-2 text-sm text-gray-500">
            Explore our collections, organized around the things you need.
          </p>
        </div>
        {failed ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500">
            Categories and their products could not be loaded. Refresh the page
            to try again.
          </div>
        ) : categories.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category._id}`}
                className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-blue-50">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl font-bold text-[#2563eb]/70">
                      {category.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="font-semibold">{category.name}</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Explore products
                    </p>
                  </div>
                  <ArrowRight size={17} className="text-[#2563eb]" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500">
            No categories with products are available right now.
          </div>
        )}
      </div>
    </main>
  );
}

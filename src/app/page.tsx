import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import ProductCard from "@/app/components/products/ProductCard";
import {
  filterCategoriesWithProducts,
  getBrands,
  getCategories,
  getStorefrontProducts,
} from "@/services/product.service";

const categoryColors = [
  "bg-indigo-50",
  "bg-rose-50",
  "bg-violet-50",
  "bg-sky-50",
  "bg-amber-50",
  "bg-cyan-50",
];
export default async function HomePage() {
  const [productResult, categoryResult, brandResult] = await Promise.allSettled(
    [getStorefrontProducts(), getCategories(), getBrands()],
  );
  const allProducts =
    productResult.status === "fulfilled"
      ? productResult.value.data || []
      : [];
  const products = allProducts.slice(0, 8);
  const categories =
    categoryResult.status === "fulfilled"
      ? filterCategoriesWithProducts(
          categoryResult.value.data || [],
          allProducts,
        ).slice(0, 6)
      : [];
  const brands =
    brandResult.status === "fulfilled"
      ? brandResult.value.data?.slice(0, 8) || []
      : [];
  const catalogCategories =
    categoryResult.status === "fulfilled" ? categoryResult.value.data || [] : [];
  const getProductImage = (categoryName: string) =>
    allProducts.find(
      (product) =>
        product.category?.name.toLowerCase() === categoryName.toLowerCase(),
    )?.imageCover;
  const heroTiles = [
    {
      title: "Home essentials",
      image:
        catalogCategories.find((category) => category.name.toLowerCase() === "home")
          ?.image ||
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Men's fashion",
      image:
        getProductImage("Men's Fashion") ||
        catalogCategories.find((category) => category.name === "Men's Fashion")
          ?.image,
    },
    {
      title: "Women's fashion",
      image:
        getProductImage("Women's Fashion") ||
        catalogCategories.find((category) => category.name === "Women's Fashion")
          ?.image,
    },
    {
      title: "Electronics",
      image:
        getProductImage("Electronics") ||
        catalogCategories.find((category) => category.name === "Electronics")
          ?.image,
    },
  ].filter((tile): tile is { title: string; image: string } => Boolean(tile.image));

  return (
    <main>
      <section className="page-shell pt-6">
        <div className="grid overflow-hidden rounded-2xl border border-slate-100 bg-[#f7f9ff] lg:min-h-[450px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1d4ed8] shadow-sm">
              <BadgeCheck size={15} /> Home · Fashion · Tech
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#21313c] sm:text-5xl">
              Good finds for every part of your day.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#59656b] sm:text-base">
              Explore home essentials, men's and women's fashion, and everyday
              electronics in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Explore the collection <ArrowRight size={17} />
              </Link>
              <Link href="/categories" className="btn-outline">
                Browse categories
              </Link>
            </div>
            <p className="mt-5 text-xs font-medium text-[#64748b]">
              Style, comfort, and technology for everyday living
            </p>
          </div>
          <div className="grid min-h-[340px] grid-cols-2 grid-rows-2 gap-2 p-2 sm:min-h-[420px] sm:gap-3 sm:p-3">
            {heroTiles.map((tile) => (
              <div
                key={tile.title}
                className="group relative min-h-36 overflow-hidden rounded-xl bg-slate-200"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm sm:bottom-4 sm:left-4 sm:text-sm">
                  {tile.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[#2563eb]">
              Browse the collection
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#21313c] sm:text-3xl">
              Shop by category
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb]"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {categories.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Link
                href={`/categories/${category._id}`}
                key={category._id}
                className={`group overflow-hidden rounded-xl border border-gray-100 ${categoryColors[index % categoryColors.length]} p-3 text-center transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white/70">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#2563eb]/70">
                      {category.name.slice(0, 1)}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-[#21313c]">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-[#f7f8f8] p-8 text-center text-sm text-gray-500">
          No categories with products are available right now.
          </div>
        )}
      </section>

      <section className="bg-[#f7f8f8] py-12 sm:py-16">
        <div className="page-shell">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-[#2563eb]">
                Picked for you
              </p>
              <h2 className="mt-1 text-2xl font-bold text-[#21313c] sm:text-3xl">
                Popular products
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb]"
            >
              Shop all <ArrowRight size={16} />
            </Link>
          </div>
          {products.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-sm text-gray-500">
              Featured products are loading. Explore the full shop to see the
              collection.
            </div>
          )}
        </div>
      </section>

      <section className="page-shell py-12 sm:py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-[#2563eb]">
              Shop your favorites
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#21313c] sm:text-3xl">
              Popular brands
            </h2>
          </div>
          <Link
            href="/brands"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb]"
          >
            All brands <ArrowRight size={16} />
          </Link>
        </div>
        {brands.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-white p-4 text-center transition hover:border-[#bfdbfe] hover:shadow-sm"
              >
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-10 max-w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-[#60727b]">
                    {brand.name.slice(0, 1)}
                  </span>
                )}
                <span className="line-clamp-1 text-xs font-medium">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}

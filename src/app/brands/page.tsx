import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBrands, type CatalogItem } from "@/services/product.service";

export default async function BrandsPage() {
  let brands: CatalogItem[] = [];
  let failed = false;
  try {
    brands = (await getBrands()).data || [];
  } catch {
    failed = true;
  }

  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell">
        <nav className="mb-5 text-xs text-gray-500">
          <Link href="/">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#21313c]">Brands</span>
        </nav>
        <div className="mb-7">
          <p className="text-sm font-medium text-[#2563eb]">
            Good things from names you know
          </p>
          <h1 className="mt-1 text-3xl font-bold">Discover our brands</h1>
          <p className="mt-2 text-sm text-gray-500">
            Shop trusted names and find something new.
          </p>
        </div>
        {failed ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500">
            Brands could not be loaded. Refresh the page to try again.
          </div>
        ) : brands.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                href={`/brands/${brand._id}`}
                className="group flex min-h-44 flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-5 text-center transition hover:border-[#bfdbfe] hover:shadow-md"
              >
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="h-20 w-full object-contain transition group-hover:scale-105"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eff6ff] text-3xl font-bold text-[#2563eb]">
                    {brand.name.slice(0, 1)}
                  </span>
                )}
                <h2 className="mt-3 font-semibold">{brand.name}</h2>
                <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#2563eb]">
                  View products <ArrowRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500">
            No brands are available right now.
          </div>
        )}
      </div>
    </main>
  );
}

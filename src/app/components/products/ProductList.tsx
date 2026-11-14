"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/utils/types/product";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ProductList({
  products,
  initialKeyword = "",
}: {
  products: Product[];
  initialKeyword?: string;
}) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [sort, setSort] = useState("featured");
  const visibleProducts = useMemo(() => {
    const matched = products.filter((product) =>
      product.title.toLowerCase().includes(keyword.toLowerCase()),
    );
    if (sort === "price-low")
      return [...matched].sort((a, b) => a.price - b.price);
    if (sort === "price-high")
      return [...matched].sort((a, b) => b.price - a.price);
    if (sort === "rating")
      return [...matched].sort(
        (a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0),
      );
    return matched;
  }, [keyword, products, sort]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 sm:w-72">
          <Search size={17} className="text-gray-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search this collection"
            className="w-full text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <SlidersHorizontal size={16} />
          <label htmlFor="sort-products">Sort by</label>
          <select
            id="sort-products"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#21313c] outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>
      {visibleProducts.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
          <h2 className="text-xl font-semibold">No products found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Try another search or explore all products.
          </p>
        </div>
      )}
    </>
  );
}

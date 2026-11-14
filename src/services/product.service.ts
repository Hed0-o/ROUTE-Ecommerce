import { API_BASE_URL } from "./api";
import type { Product } from "@/utils/types/product";

export interface CatalogItem {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  createdAt?: string;
}

export function filterCategoriesWithProducts(
  categories: CatalogItem[],
  products: Product[],
) {
  const categoryIds = new Set(
    products
      .map((product) => product.category?._id)
      .filter((categoryId): categoryId is string => Boolean(categoryId)),
  );

  return categories.filter((category) => categoryIds.has(category._id));
}

interface ListResponse<T> {
  results?: number;
  metadata?: { currentPage?: number; numberOfPages?: number; limit?: number };
  data: T[];
}

interface ItemResponse<T> {
  data: T;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getProducts(
  search = "",
  filters: { category?: string; brand?: string } = {},
) {
  const query = new URLSearchParams();
  query.set("limit", "100");
  query.set("sort", "-ratingsAverage");

  if (search) {
    query.set("keyword", search);
  }
  if (filters.category) query.set("category[in]", filters.category);
  if (filters.brand) query.set("brand", filters.brand);

  return getJson<ListResponse<Product>>(`/products?${query.toString()}`);
}

export async function getStorefrontProducts(
  search = "",
  filters: { category?: string; brand?: string } = {},
) {
  return getProducts(search, filters);
}

export async function getProductById(id: string) {
  const result = await getJson<ItemResponse<Product>>(`/products/${id}`);
  return result.data;
}

export async function getCategories() {
  return getJson<ListResponse<CatalogItem>>("/categories?limit=100");
}

export async function getCategoryById(id: string) {
  const result = await getJson<ItemResponse<CatalogItem>>(`/categories/${id}`);
  return result.data;
}

export async function getBrands() {
  return getJson<ListResponse<CatalogItem>>("/brands?limit=100");
}

export async function getBrandById(id: string) {
  const result = await getJson<ItemResponse<CatalogItem>>(`/brands/${id}`);
  return result.data;
}

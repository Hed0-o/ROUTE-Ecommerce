import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetails from "@/app/components/products/ProductDetails";
import { getProductById } from "@/services/product.service";

type ProductParams = Promise<{ id: string }>;

export default function ProductDetailsPage({
  params,
}: {
  params: ProductParams;
}) {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}

async function ProductDetailsContent({ params }: { params: ProductParams }) {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return <ProductDetails product={product} />;
  } catch {
    notFound();
  }
}

function ProductDetailsLoading() {
  return (
    <main className="min-h-[60vh] bg-[#f7f8f8] py-8">
      <div className="page-shell animate-pulse">
        <div className="mb-5 h-4 w-56 rounded bg-gray-200" />
        <div className="grid gap-8 rounded-2xl bg-white p-5 sm:p-8 lg:grid-cols-2">
          <div className="aspect-square rounded-xl bg-gray-100" />
          <div className="space-y-5 py-4">
            <div className="h-4 w-28 rounded bg-gray-100" />
            <div className="h-8 w-4/5 rounded bg-gray-100" />
            <div className="h-6 w-36 rounded bg-gray-100" />
            <div className="h-24 rounded bg-gray-100" />
            <div className="h-12 rounded-lg bg-gray-100" />
          </div>
        </div>
      </div>
    </main>
  );
}

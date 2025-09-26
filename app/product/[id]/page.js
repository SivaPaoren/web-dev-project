export default async function Home({ params }) {
  const API_BASE = "http://localhost:3000/app/stock/api";

  try {
    const res = await fetch(`${API_BASE}/product/${params.id}`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const product = await res.json();
    console.log("Fetched product:", product);

    return (
      <div className="m-4">
        <h1>Product</h1>
        <p className="font-bold text-xl text-blue-800">{product?.name}</p>
        <p>{product?.description}</p>
        <p>{product?.price} Baht</p>
        <p>Category: {product?.category?.name || "No category"}</p>
      </div>
    );
  } catch (err) {
    console.error("Error fetching product:", err);
    return (
      <div className="m-4">
        <h1>Product</h1>
        <p className="text-red-600">Failed to load product.</p>
      </div>
    );
  }
}

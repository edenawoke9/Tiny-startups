import React, { useEffect, useState } from "react";

const groupProducts = (products: any[]) => {
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const now = new Date().getTime();

  const grouped = {
    thisWeek: [] as any[],
    older: [] as any[],
  };

  for (const product of products) {
    const created = new Date(product.createdAt).getTime();
    if (now - created <= oneWeek) {
      grouped.thisWeek.push(product);
    } else {
      grouped.older.push(product);
    }
  }

  return grouped;
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const grouped = groupProducts(products);
  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Launched This Week</h1>
      {grouped.thisWeek.map((p) => (
        <div key={p._id} className="border p-3 rounded mb-2">
          <h2 className="font-semibold">{p.title}</h2>
          <p>{p.description}</p>
          {currentUserId === p.owner && (
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600">Edit</button>
              <button className="text-red-600">Delete</button>
            </div>
          )}
        </div>
      ))}

      <h1 className="text-2xl font-bold mt-8 mb-4">Older Launches</h1>
      {grouped.older.map((p) => (
        <div key={p._id} className="border p-3 rounded mb-2">
          <h2 className="font-semibold">{p.title}</h2>
          <p>{p.description}</p>
          {currentUserId === p.owner && (
            <div className="flex gap-2 mt-2">
              <button className="text-blue-600">Edit</button>
              <button className="text-red-600">Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

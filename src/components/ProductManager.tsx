// ✅ ProductManager.tsx
"use client";

import { useState } from "react";
import StartUpSubmitForm from "./StartUpSubmitForm";

interface Product {
  id: number;
  name: string;
  description: string;
  ownerEmail: string;
}

export default function ProductManager({
  currentUserEmail,
}: {
  currentUserEmail: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const handleDeleteProduct = (id: number, email: string) => {
    if (email !== currentUserEmail)
      return alert("You can only delete your own product!");
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleUpdateProduct = (
    id: number,
    newName: string,
    newDesc: string,
    email: string
  ) => {
    if (email !== currentUserEmail)
      return alert("You can only update your own product!");
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, name: newName, description: newDesc }
          : product
      )
    );
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      <StartUpSubmitForm
        currentUserEmail={currentUserEmail}
        onAddProduct={handleAddProduct}
      />

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">📦 Your Products</h2>
        {products.length === 0 && (
          <p className="text-gray-500">No products yet.</p>
        )}
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-sm text-gray-400">Owner: {product.ownerEmail}</p>
            {product.ownerEmail === currentUserEmail && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name:", product.name);
                    const newDesc = prompt(
                      "Enter new description:",
                      product.description
                    );
                    if (newName && newDesc)
                      handleUpdateProduct(
                        product.id,
                        newName,
                        newDesc,
                        product.ownerEmail
                      );
                  }}
                  className="bg-yellow-300 text-black px-3 py-1 rounded hover:bg-yellow-400"
                >
                  Update
                </button>
                <button
                  onClick={() =>
                    handleDeleteProduct(product.id, product.ownerEmail)
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

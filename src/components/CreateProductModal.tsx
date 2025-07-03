"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Or cookie
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        onClose();
        router.push("/products");
      } else {
        console.error("Failed to create product");
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create a Product</h2>
        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 mb-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-3 py-1 bg-black text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

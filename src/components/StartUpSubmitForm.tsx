import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  ownerEmail: string;
}

export default function StartUpSubmitForm({
  currentUserEmail,
  onAddProduct,
}: {
  currentUserEmail: string;
  onAddProduct: (product: Product) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return alert("Fill all fields");

    const newProduct: Product = {
      id: Date.now(),
      name,
      description,
      ownerEmail: currentUserEmail,
    };

    onAddProduct(newProduct);
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-3">Submit a New Product</h2>
      <input
        type="text"
        placeholder="Startup Name"
        className="block w-full mb-2 p-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="block w-full mb-2 p-2 border rounded resize-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Submit Product
      </button>
    </form>
  );
}

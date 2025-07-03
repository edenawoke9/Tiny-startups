"use client";
import { useState } from "react";
import CreateProductModal from "./CreateProductModal"; // Adjust the path

export default function Header() {
  const [showModal, setShowModal] = useState(false);

  console.log("Modal open?", showModal); // Debug: check console when clicking

  return (
    <nav className="flex justify-between p-4 bg-gray-100">
      <button
        onClick={() => {
          console.log("Launch button clicked");
          setShowModal(true);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Launch
      </button>

      {showModal && <CreateProductModal onClose={() => setShowModal(false)} />}
    </nav>
  );
}

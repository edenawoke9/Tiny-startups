'use client'
import React, { useEffect, useState } from "react";
import { getUserProducts } from "@/lib/firestore";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Product } from "@/lib/types";
import { MessageCircle,CircleChevronUp } from "lucide-react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

export default function MyProducts() {
  const { user } = useFirebaseAuth();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (user && user.uid) {
      getUserProducts(user.uid).then(product=>setProducts(product));
    }
  }, [user]);

  return (
    <div className="mt-32 flex flex-col w-full  items-center ">
        <div className="flex relative w-2/3 md:w-1/2 "><input className="bg-gray-100 w-full pl-10 ring-2 ring-green-300  p-4 rounded-full" placeholder="Search your products"/>
        <SearchIcon className="absolute left-2  h-full "/></div>
        
      {products.length > 0
        ? products.map((product) => (<div
            className={`group  bg-white hover:bg-gray-50 mt-16 w-5/6 md:w-2/3  rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-2 hover:border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 z-40`}
          >
            <div className="flex items-center gap-x-5">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl text-2xl h-14 w-14 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                {product.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-x-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                </div>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{product.description}</p>
              </div>
              <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl  w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                <MessageCircle />
                <p className="text-sm font-bold text-gray-700 mt-1">{product.commentsCount || 0}</p>
              </div>
              <button
                disabled={!user}
                onClick={e => {
                  e.stopPropagation();
                  
                }}
                className={`flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl  w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-105 `}
              >
                <CircleChevronUp />
                <p className="text-sm font-bold text-gray-700 mt-1">{product.upvotes || 0}</p>
              </button>
            </div>
          </div>
          ))
        : <div>No products found.
          <div className="text-black bg-gradient-to-r from-[#e14eca] to-[#3b82f6] p-[2px] animated-button1 rounded-2xl relative overflow-hidden">
  <button  className="bg-white rounded-xl w-full relative z-10"><Link href="/submit-product">New Launch</Link></button >
  <span />
  <span />
  <span />
  <span />
</div>
        </div>
        
      }
    </div>
  );
}
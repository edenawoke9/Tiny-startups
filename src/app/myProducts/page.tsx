"use client"
import { useEffect, useState, useMemo } from "react"
import { getUserProducts } from "@/lib/firestore"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import type { Product } from "@/lib/types"
import { MessageCircle, CircleChevronUp, Search, Plus, Package, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { deleteProduct, updateProduct } from "@/lib/firestore";
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function MyProducts() {
  const { user } = useFirebaseAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router=useRouter()

  useEffect(() => {
    if (user && user.uid) {
      setIsLoading(true)
      getUserProducts(user.uid)
        .then((product) => {
          setProducts(product)
          setIsLoading(false)
        })
        .catch(() => setIsLoading(false))
    }
  }, [user])

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [products, searchQuery])

  const handleDelete = async (productId: string) => {
    if (!user) return;
    await deleteProduct(productId, user.uid);
    setProducts(products => products.filter(p => p.id !== productId));
    setOpenMenuId(null);
  };

  const handleUpdate = (product: Product) => {
    // You can open a modal or inline form here
    alert("Update logic here for: " + product.name);
    setOpenMenuId(null);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-full mb-8 shadow-lg">
        <Package className="h-16 w-16 text-purple-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">No products yet</h3>
      <p className="text-gray-600 text-center mb-10 max-w-md text-lg leading-relaxed">
        {searchQuery
          ? `No products found matching "${searchQuery}". Try a different search term.`
          : "You haven't launched any products yet. Create your first product to get started!"}
      </p>
      {!searchQuery && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <Link
            href="/submit-product"
            className="relative flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-semibold text-gray-900 hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            Launch Your First Product
          </Link>
        </div>
      )}
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-3xl shadow-lg p-8 animate-pulse">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
            </div>
            <div className="flex gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-2xl"></div>
              <div className="h-16 w-16 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-100  pt-32 pb-20 bg-amber-400">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            My Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Manage and track your launched products. See how they're performing and engage with your community.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur opacity-20"></div>
          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search your products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-6 text-lg bg-transparent border-none outline-none focus:ring-0 rounded-3xl placeholder-gray-400"
            />
          </div>
        </div>

        {/* Products List */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="group bg-white/80 backdrop-blur-sm hover:bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 p-8 transition-all duration-500 ease-out hover:-translate-y-2 relative overflow-visible "
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/0 to-blue-50/0 group-hover:from-purple-50/30 group-hover:to-blue-50/30 transition-all duration-500 rounded-3xl"></div>

                <div className="relative flex items-center gap-8">
                  {/* Product Icon */}
                  <div className="bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 p-5 rounded-3xl text-3xl h-20 w-20 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {product.image && product.image.trim() !== "" ? (
                      <span className="font-bold w-6 h-6 rounded-full ">
                        <Image src={product.image} height={24} width={24} alt="product image" className="w-full h-full"/>
                      </span>
                    ) : (
                      <span className="font-bold text-purple-600 group-hover:text-purple-700">
                        {product.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                    
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="font-bold text-2xl text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                        {product.name}
                      </h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-200">
                        Live
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed line-clamp-2 text-base">{product.description}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 flex-shrink-0">
                    {/* Comments */}
                    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-300 rounded-2xl w-20 h-20 transition-all duration-300 group-hover:scale-110 cursor-pointer shadow-md hover:shadow-lg">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-bold text-blue-700 mt-1">{product.commentsCount || 0}</span>
                    </div>

                    {/* Upvotes */}
                    <button
                      disabled={!user}
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle upvote logic here
                      }}
                      className="flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 hover:border-orange-300 rounded-2xl w-20 h-20 transition-all duration-300 group-hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <CircleChevronUp className="h-6 w-6 text-orange-600" />
                      <span className="text-sm font-bold text-orange-700 mt-1">{product.upvotes || 0}</span>
                    </button>
                  </div>
                </div>

                {/* 3-dot menu for product owner */}
                
                  <div className="absolute bottom-0  right-8 z-10">
                    <div>
                      <button
                        className="p-2 relative rounded-full hover:bg-gray-200"
                        aria-label="Product actions"
                        onClick={() => setOpenMenuId(openMenuId === product.id ? null : (product.id ?? null))}
                      >
                        <MoreHorizontal className="w-6 h-6" />
                      </button>
                      {openMenuId === product.id && (
                        <div className=" bg-white absolute top-full right-0  w-32  border rounded shadow-lg z-40">
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => router.push(`/submit-product/update/${product.id}`)}
                          >
                            Update
                          </button>
                          <button
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                            onClick={() => handleDelete(product.id!)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
               
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {/* Floating Action Button */}
        {products.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
              <Link
                href="/submit-product"
                className="relative flex items-center justify-center h-16 w-16 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:scale-110"
              >
                <Plus className="h-8 w-8 text-white" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getProducts, upvoteProduct } from "../../lib/firestore"
import { MessageCircle} from "lucide-react"
import { CircleChevronUp } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import Image from "next/image"
import { Tag } from "lucide-react"
import Link from "next/link"
import { Product } from "../../lib/types";


function StartupItem({ startup, isPromoted = false }: { startup: Product; isPromoted?: boolean }) {
  const { user } = useFirebaseAuth();
  const [upvote, setUpvote] = useState<number>(startup.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(user ? startup.upvotedBy.includes(user.uid) : false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpvote(startup.upvotes);
    setHasUpvoted(user ? startup.upvotedBy.includes(user.uid) : false);
  }, [startup.upvotes, startup.upvotedBy, user]);

  const handleUpvote = async (startup: Product) => {
    if (!user) return;
    setLoading(true);
    try {
      if (!startup.id) return;
      await upvoteProduct(startup.id, user.uid);
      if (hasUpvoted) {
        setUpvote(u => u - 1);
        setHasUpvoted(false);
      } else {
        setUpvote(u => u + 1);
        setHasUpvoted(true);
      }
    } catch {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const imageSrc = (typeof startup.image === 'string' && startup.image.trim() !== '' ? startup.image : '/logo.jpg') as string;

  return (
    <div
      className={`group  bg-white hover:bg-gray-50  rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 p-2 hover:border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 z-40${
        isPromoted ? "ring-2 ring-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50" : ""
      }`}
    >
      <div className="flex items-center gap-x-5">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl  text-2xl h-14 w-14 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
          {startup.image && startup.image.trim() !== "" ? (
            <span className="font-bold w-full h-full rounded-full">
              <Image
                src={`${imageSrc}`}
                height={24}
                width={24}
                alt="product image"
                className="w-full h-full rounded-2xl"
              />
            </span>
          ) : (
            <span className="font-bold text-purple-600 group-hover:text-purple-700">
              {startup.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-x-3 mb-2">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
              {startup.name}
            </h3>
          
          </div>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{startup.description}</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl  w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
          <MessageCircle />
          <p className="text-sm font-bold text-gray-700 mt-1">{startup.commentsCount || 0}</p>
        </div>
        <button
          disabled={!user || loading}
          onClick={e => {
            e.stopPropagation();
            handleUpvote(startup);
          }}
          className={`flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl  w-14 h-14 flex-shrink-0 transition-all duration-300 group-hover:scale-105 ${hasUpvoted ? 'bg-orange-100 border-orange-300' : ''}`}
        >
          <CircleChevronUp />
          <p className="text-sm font-bold text-gray-700 mt-1">{upvote || 0}</p>
        </button>
      </div>
      <div className="flex items-center pt-2 gap-2 flex-wrap">
        <Tag className="pl-2 "/>
      {startup.tags && ((startup.tags).map((tag:string,index:number)=>(
           <div key={index} className="text-black flex    shadow-b-sm  gap-2 h-full  text-sm">
            {tag}
            <span className="text-blue-400 h-full items-center pr-2">.</span>
           
           </div>
            

        ))
         )}
      </div>
        
      
    </div>
  );
}

type ProductsProps = {
  ActiveMonth: { month: number; name: string; range: string }
};

export default function Products({ ActiveMonth }: ProductsProps) {
  console.log(ActiveMonth)
  const [startups, setStartups] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        setStartups(products || []);
        setError(null);
      } catch {
        setError("Failed to load products");
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = async (startup: Product) => {
    try {
      router.push(`/products/${startup.id}`);
    } catch {
      router.push(`/products/${startup.name}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ">
      {/* Top Startups Section */}
      <div className="mb-16 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800"> Top Startups</h2>
        </div>
        <div className="space-y-4 mt-4">
          {startups.length > 0 ? (
            startups.map((startup, index) => (
              <div
                key={startup.id || index}
                onClick={() => handleProductClick(startup)}
                className="w-full text-left cursor-pointer"
              >
                <StartupItem startup={startup} isPromoted={false} />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products found for this month.</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Startup?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully launched their startups. Get featured in our weekly
            showcase and reach potential customers and investors.
          </p>
          <Link href="/submit-product/lanuch" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Submit Your Startup
          </Link>
        </div>
      </div>
    </div>
  )
}


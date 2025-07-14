"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getProducts, getProduct } from "../../lib/firestore"

const featured = [
  {
    name: "Social Intents",
    desc: "AI Chatbots backed by your team in Microsoft Teams, Slack, and Google Chat.",
  },
  {
    name: "Capgo",
    desc: "Instant updates for Capacitor. Ship updates, fixes, changes, and features...",
  },
  {
    name: "ServerScheduler",
    desc: "Slash cloud costs with server scheduling. AWS, GCP, Azure.",
  },
  {
    name: "Startups.fm",
    desc: "The ultimate startup discovery platform for entrepreneurs and investors.",
  },
]

const moreStartups = [
  {
    name: "DevFlow",
    desc: "Streamline your development workflow with intelligent automation.",
  },
  {
    name: "DataViz",
    desc: "Beautiful data visualizations for your business insights.",
  },
  {
    name: "CloudSync",
    desc: "Seamless cloud synchronization across all your devices.",
  },
  {
    name: "AI Assistant",
    desc: "Your personal AI assistant for productivity and creativity.",
  },
]

const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="text-yellow-500"
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z" />
  </svg>
)

const UpvoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-gray-600"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const TrendingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-green-500"
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </svg>
)

const StartupItem = ({ startup, index, isPromoted = false }: { startup: any; index: number; isPromoted?: boolean }) => (
  <div
    className={`group  bg-white hover:bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 ease-in-out transform hover:-translate-y-1 z-40${
      isPromoted ? "ring-2 ring-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50" : ""
    }`}
  >
   

          <div className="flex items-center gap-x-5">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl text-2xl h-16 w-16 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300">
          {startup.name.charAt(0).toUpperCase()}
        </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-x-3 mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
            {startup.name}
          </h3>
          {isPromoted && (
            <div className="flex items-center gap-1">
              <TrendingIcon />
              <span className="text-xs font-semibold text-green-600">Trending</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{startup.desc}</p>
      </div>

      {startup.votes !== null && startup.votes !== undefined && (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 border border-gray-200 hover:border-orange-300 rounded-xl p-3 w-20 h-20 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
          <UpvoteIcon />
          <p className="text-sm font-bold text-gray-700 mt-1">{startup.votes}</p>
        </div>
      )}
    </div>
  </div>
)

export default function Products({ ActiveMonth }: { ActiveMonth: any }) {
  const [startups, setStartups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const products = await getProducts()
        setStartups(products || [])
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products")
        setStartups([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleClick = (startup: any) => {
    const name = startup.name
    router.push(`/products/${name}`)
  }

  const handleProductClick = async (startup: any) => {
    try {
      
      const productDetails = await getProduct(startup.id || startup.name)
      console.log("Product details:", productDetails)
      
     
      router.push(`/products/${startup.id}`)
    } catch (err) {
      console.error("Error fetching product details:", err)
     
      router.push(`/products/${startup.name}`)
    }

  }

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <h1 className="text-2xl font-light font-serif text-gray-800 flex justify-start mt-10">
        {ActiveMonth.name}
      </h1>

      {/* Top Startups Section */}
      <div className="mb-16 mt-10">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">🚀 Top Startups</h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-orange-400 to-transparent rounded-full"></div>
        </div>
        <div className="space-y-4 mt-4">
          {startups.length > 0 ? (
            startups.map((startup, index) => (
              <button key={startup.id || index} onClick={() => handleProductClick(startup)} className="w-full text-left">
                <StartupItem startup={startup} index={index} />
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No products found for this month.</p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">⭐ Featured This Week</h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Featured this week</h2>
          <div className="space-y-4">
            {featured.map((startup, index) => (
              <button key={index} onClick={() => handleClick(startup)} className="w-full text-left">
                <StartupItem startup={startup} index={index} isPromoted={true} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* More Startups Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">💎 More Discoveries</h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-purple-400 to-transparent rounded-full"></div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">More from this week</h2>
          <div className="space-y-4">
            {moreStartups.map((startup, index) => (
              <button key={index} onClick={() => handleClick(startup)} className="w-full text-left">
                <StartupItem startup={startup} index={startups.length + featured.length + index} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Startup?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have successfully launched their startups. Get featured in our weekly
            showcase and reach potential customers and investors.
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Submit Your Startup
          </button>
        </div>
      </div>
    </div>
  )
}


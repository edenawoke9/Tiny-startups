"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ThumbsUp, Share2 } from "lucide-react"
import products from "@/lib/products.json"

export default function ProductPage({ params }: { params: any }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [commentText, setCommentText] = useState("")

  const name = decodeURIComponent(params.name)
  // Search all groups for the product
  const allProducts = [...(products.startups || []), ...(products.moreStartups || []), ...(products.featured || [])]
  const product = allProducts.find((p: any) => p.name && p.name.toLowerCase() === name.toLowerCase())

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p>No product found for "{name}".</p>
      </div>
    )
  }

  const hasIcon = (product as any).icon
  const votes = (product as any)?.votes ?? 66

  // Sample carousel images
  const carouselImages = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Sample comments data
  const comments = [
    {
      id: 1,
      user: {
        name: "Dan SRK",
        avatar: "DS",
        role: "Tech enthusiast consultant with a busine...",
        color: "bg-teal-500",
      },
      content:
        "Thanks for checking out inputeer! I built this out of pure frustration with repeating myself every time I started a new AI chat—explaining my project, business, or research background over and over. I wanted a way to upload everything once, get one clean brief, and start every chat with full context, not from zero.\n\nThe process wasn't easy—getting reliable PDF-to-text extraction and a clear, friendly workflow took a ton of iteration (and some tough lessons from early testers). But I'm genuinely proud of how simple the end result is: just upload your files, and you get a context doc you can use with any AI, instantly.\n\nI'd love to hear how you'd use this, any features you'd add (or cut), and your honest feedback. Appreciate your time and support!",
      timestamp: "5h ago",
      upvotes: 0,
      hasUpvoted: false,
    },
    {
      id: 2,
      user: {
        name: "Lantos Sar",
        avatar: "L",
        role: "indiehacker",
        color: "bg-purple-500",
      },
      content: "Amazing, that's gonna help when using llms for docs",
      timestamp: "5h ago",
      upvotes: 0,
      hasUpvoted: false,
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-4">
              {hasIcon && (
                <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  sp
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
                <p className="text-gray-600 mb-3">{product.desc}</p>
                <div className="text-sm text-gray-500">0 reviews</div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors">
                Visit website
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                Socialprofiler helps you quickly and clearly understand who you're really dealing with online and
                offline. Whether you're dating someone new, hiring help at home, concerned about your kid's safety, or
                just curious—Socialprofiler gives instant insights.
              </p>
            </div>
          </div>

          {/* Navigation Tab */}
          <div className="px-6 py-3 border-b">
            <button className="text-gray-700 font-medium border-b-2 border-gray-300 pb-2">Overview</button>
          </div>

          {/* Image Carousel */}
          <div className="p-6">
            <div className="relative">
              <div className="overflow-hidden rounded-lg bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
                <div className="relative h-80 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=320&width=600"
                    alt="Product screenshot"
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Carousel Dots */}
              <div className="flex justify-center mt-4 gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-red-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">What do you think? ...</h3>

              {/* Comment Input */}
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                  @
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className={`w-10 h-10 ${comment.user.color} rounded-full flex items-center justify-center text-white font-medium text-sm`}
                  >
                    {comment.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="font-medium text-gray-900">{comment.user.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{comment.user.role}</span>
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">
                      {comment.content}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <span className="text-red-500">No need for</span>
                        <ThumbsUp className="w-4 h-4" />
                        <span>upvote</span>
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 transition-colors">Reply</button>
                      <span className="text-gray-400">{comment.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          {/* Voting Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-900">{votes}</div>
              <div className="text-sm text-gray-500">Upvotes</div>
            </div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg mb-3 transition-colors flex items-center justify-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Upvote
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg mb-4 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <div className="border-t pt-4">
              <div className="text-xs text-gray-500 mb-3">Added by</div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                  M
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Miro Cichy</div>
                  <div className="text-xs text-gray-500">Creator</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="text-sm font-medium text-gray-900 mb-2">Social Links</div>
              <a href="#" className="text-gray-900 hover:text-blue-600 transition-colors text-lg">
                𝕏
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-blue-600 rounded-lg p-6 text-white">
            <div className="text-center mb-4">
              <div className="text-sm font-medium mb-1">⭐ Trending products & news</div>
              <div className="text-sm mb-1">⭐ The FREE weekly report</div>
              <div className="text-sm">⭐ Curated by a human</div>
            </div>
            <div className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded text-gray-900 text-sm" />
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium text-sm transition-colors">
                Subscribe
              </button>
            </div>
            <div className="text-center text-xs mt-3 opacity-90">Join 17,800+ subscribed experts</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

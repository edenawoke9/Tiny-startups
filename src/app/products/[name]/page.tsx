"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, ThumbsUp, Share2 } from "lucide-react";
import products from "@/lib/products.json";

export default function ProductPage({ params }: { params: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const { data: session } = useSession();

  const name = decodeURIComponent(params.name);

  const allProducts = [
    ...(products.startups || []),
    ...(products.moreStartups || []),
    ...(products.featured || []),
  ];
  const product = allProducts.find(
    (p: any) => p.name?.toLowerCase() === name.toLowerCase()
  );

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch(`/api/comments/${encodeURIComponent(name)}`);
      const data = await res.json();
      setComments(data);
    };

    fetchComments();
  }, [name]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    const user = {
      name: session?.user?.name || "Anonymous",
      avatar: session?.user?.name?.charAt(0) || "A",
      role: session?.user ? "Authenticated" : "Guest",
      color: "bg-blue-500",
    };

    const res = await fetch(`/api/comments/${encodeURIComponent(name)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, content: commentText }),
    });

    const newComment = await res.json();
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  };

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p>No product found for "{name}".</p>
      </div>
    );
  }

  const carouselImages = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  const votes = (product as any)?.votes ?? 0;
  const hasIcon = (product as any).icon;

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
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {product.name}
                </h1>
                <p className="text-gray-600 mb-3">{product.desc}</p>
                <div className="text-sm text-gray-500">
                  {comments.length} reviews
                </div>
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors">
                Visit website
              </button>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="p-6">
            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <div className="relative h-80 flex items-center justify-center">
                  <img
                    src={carouselImages[currentSlide]}
                    alt="Product screenshot"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              What do you think?
            </h3>

            {/* Comment Input */}
            <div className="flex gap-3 mb-6">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                {session?.user?.name?.charAt(0) || "@"}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Comment
                  </button>
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
                      <span className="font-medium text-gray-900">
                        {comment.user.name}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        {comment.user.role}
                      </span>
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">
                      {comment.content}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-400">
                        {comment.timestamp || "Just now"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold text-gray-900">{votes}</div>
              <div className="text-sm text-gray-500">Upvotes</div>
            </div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg mb-3 flex items-center justify-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Upvote
            </button>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg mb-4 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

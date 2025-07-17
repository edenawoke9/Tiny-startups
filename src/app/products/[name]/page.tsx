"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ThumbsUp, Share2 } from "lucide-react"
import { MoreHorizontal } from "lucide-react"
import { getProduct, getProductComments, createComment, upvoteProduct,getUser, deleteComment } from "@/lib/firestore"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { Product, Comment } from "@/lib/types"
import React from "react"
import { CircleChevronUp } from "lucide-react"

function UserName({ id }: { id: string }) {
  console.log("id is ",id)
  const [name, setName] = useState<string>("...");

  useEffect(() => {
    getUser(id).then(user => {setName(user?.name || "Unknown"); console.log(user)});
  }, [id]);

  return <p>{name}</p>;
}


export default function ProductPage({ params }: { params: any }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [commentText, setCommentText] = useState("")
  const [product, setProduct] = useState<Product | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [upvoting, setUpvoting] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const { user } = useFirebaseAuth()
  const { name }=React.use(params) as {name: string}
  const productId = decodeURIComponent(name)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        const [productData, commentsData] = await Promise.all([
          getProduct(productId),
          getProductComments(productId)
        ])
        
        if (productData) {
          setProduct(productData)
          
          setComments(commentsData)
        } else {
          setError("Product not found")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId])

  const handleUpvote = async () => {
    if (!user || !product) return;
    
    try {
      setUpvoting(true)
      await upvoteProduct(product.id!, user.uid)
      
      // Update local state
      setProduct(prev => {
        if (!prev) return prev;
        const hasUpvoted = prev.upvotedBy.includes(user.uid)
        return {
          ...prev,
          upvotes: hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          upvotedBy: hasUpvoted 
            ? prev.upvotedBy.filter(id => id !== user.uid)
            : [...prev.upvotedBy, user.uid]
        }
      })
    } catch (err) {
      console.error("Error upvoting:", err)
    } finally {
      setUpvoting(false)
    }
  }

  const handleComment = async () => {
    if (!user || !product || !commentText.trim()) return;
    
    try {
      setSubmittingComment(true)
      const commentId = await createComment({
        text: commentText,
        productId: product.id!
      }, user.uid)
      
      // Add new comment to local state
      const newComment: Comment = {
        id: commentId,
        productId: product.id!,
        userId: user.uid,
        text: commentText,
        createdAt: new Date()
      }
      
      setComments(prev => [...prev, newComment])
      setCommentText("")
      
      // Update product's comment count
      setProduct(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev)
    } catch (err) {
      console.error("Error creating comment:", err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    try {
      // Optimistically remove comment from UI
      setComments(prev => prev.filter(c => c.id !== commentId));
      // Call Firestore delete
      await deleteComment(commentId, user.uid);
      // Optionally update product's comment count
      setProduct(prev => prev ? { ...prev, commentsCount: prev.commentsCount - 1 } : prev);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id!);
    setEditText(comment.text);
    setShowMenu(null);
  };

  const handleSaveEdit = async (commentId: string) => {
    // Placeholder: implement Firestore update if needed
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: editText } : c));
    setEditingCommentId(null);
    setEditText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p>No product found for "{productId}".</p>
      </div>
    )
  }

  const isUpvoted = user ? product.upvotedBy.includes(user.uid) : false

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
 

  return (
    <div className="bg-gray-50 min-h-screen max-w-screen   ">
      <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto pt-24">
        {/* Main Content */}
        <div className="flex-1 bg-white overflow-hidden max-w-screen rounded-lg shadow-sm">
          {/* Header */}
          <div className="p-6 border-b ">
            <div className="flex items-start gap-4">
              {product.image && product.image.trim() !== "" ? (
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                  {product.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h1>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <div className="text-sm text-gray-500">{product.commentsCount} reviews</div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => window.open(product.url, '_blank')}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors"
                >
                  Visit website
                </button>
                <button 
                  onClick={handleUpvote}
                  disabled={upvoting || !user}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isUpvoted 
                      ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <CircleChevronUp className="w-5 h-5" />
                  {product.upvotes}
                </button>
              </div>
            </div>
            <div className="mt-4">
            
              <div className="flex gap-2 mt-3">
                {product.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tab */}
          <div className="px-6 py-3 border-b">
            <button className="text-gray-700 font-medium border-b-2 border-gray-300 pb-2">Overview</button>
          </div>

          {/* Image Carousel */}
          <div className="p-6">
            <div className="relative">
              <div className="overflow-x-auto flex gap-2 rounded-lg bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 ">
                {carouselImages.map((image)=>(<div className="relative h-80 bg-white flex items-center justify-center w-72">
                  <img
                    src={image}
                    alt="Product screenshot"
                    className="max-h-full max-w-fit object-contain"
                  />

                  {/* Navigation Arrows */}
                  
                </div>
            
))}  </div>
                
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

              {user ? (
                /* Comment Input */
                <div className="flex gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
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
                      <button 
                        onClick={handleComment}
                        disabled={submittingComment || !commentText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {submittingComment ? 'Posting...' : 'Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Please sign in to leave a comment
                </div>
              )}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    <UserName id={comment.userId} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900"> <UserName id={comment.userId} /></span>
                      {user && user.uid === comment.userId && (
                        <div className="relative inline-block text-left ml-2">
                          <button
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label="Comment actions"
                            onClick={() => setShowMenu(showMenu === comment.id ? null : (comment.id || null))}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showMenu === comment.id && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                              <button
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => handleEditComment(comment)}
                              >Edit</button>
                              <button
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                                onClick={() => handleDeleteComment(comment.id || "")}
                              >Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-line">
                      {editingCommentId === comment.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="flex-1 border rounded px-2 py-1"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                          />
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded"
                            onClick={() => handleSaveEdit(comment.id || "")}
                          >Save</button>
                          <button
                            className="px-2 py-1 bg-gray-300 text-black rounded"
                            onClick={() => setEditingCommentId(null)}
                          >Cancel</button>
                        </div>
                      ) : (
                        comment.text
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

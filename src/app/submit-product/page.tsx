"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createProduct } from "@/lib/firestore"
import { CreateProductInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react"

export default function SubmitProduct() {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: "",
    description: "",
    url: "",
    tags: []
  })
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const { user, loading: authLoading } = useFirebaseAuth()
  const router = useRouter()

  const handleInputChange = useCallback((field: keyof CreateProductInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (submitStatus !== "idle") {
      setSubmitStatus("idle")
      setSubmitMessage("")
    }
  }, [submitStatus])

  const addTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput("")
    }
  }, [tagInput, formData.tags])

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log("=== PRODUCT SUBMISSION DEBUG ===")
    console.log("Form data:", formData)
    console.log("User:", user)
    console.log("Tag input:", tagInput)
    
    if (!user) {
      console.log("❌ No user found - submission blocked")
      setSubmitStatus("error")
      setSubmitMessage("Please sign in to submit a product")
      return
    }

    if (!formData.name.trim() || !formData.description.trim() || !formData.url.trim()) {
      console.log("❌ Validation failed:")
      console.log("- Name:", formData.name.trim() ? "✅" : "❌")
      console.log("- Description:", formData.description.trim() ? "✅" : "❌")
      console.log("- URL:", formData.url.trim() ? "✅" : "❌")
      setSubmitStatus("error")
      setSubmitMessage("Please fill in all required fields")
      return
    }

    console.log("✅ Validation passed, starting submission...")

    try {
      setIsSubmitting(true)
      setSubmitStatus("idle")
      
      console.log("🚀 Calling createProduct with:", {
        productData: formData,
        userId: user.uid
      })
      
      const productId = await createProduct(formData, user.uid)
      
      console.log("✅ Product created successfully with ID:", productId)
      
      setSubmitStatus("success")
      setSubmitMessage("Product submitted successfully!")
      
      console.log("🔄 Redirecting to product page...")
      router.push(`/products/${productId}`)
      
    } catch (err) {
      console.error("❌ Error submitting product:", err)
      console.error("Error details:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : 'No stack trace',
        error: err
      })
      setSubmitStatus("error")
      setSubmitMessage("Failed to submit product. Please try again.")
    } finally {
      console.log("🏁 Submission process completed")
      setIsSubmitting(false)
    }
  }, [formData, user, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to submit a product. Please sign in with Google or GitHub to continue.
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Startup</h1>
            <p className="text-gray-600">
              Share your amazing product with the community and get feedback from fellow entrepreneurs.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <Textarea
                id="description"
                placeholder="Describe what your product does and why it's awesome..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                className="w-full"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL *
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://yourproduct.com"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  placeholder="Add a tag (e.g., AI, SaaS, Mobile)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Alert */}
            {submitStatus !== "idle" && (
              <Alert
                className={`${
                  submitStatus === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                {submitStatus === "success" ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="text-red-500 mr-2" />
                )}
                <AlertDescription>{submitMessage}</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Product"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By submitting, you agree to our community guidelines.</p>
          </div>
        </div>
      </div>
    </div>
  )
} 
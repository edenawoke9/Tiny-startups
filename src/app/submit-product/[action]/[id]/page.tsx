"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"
import { createProduct, updateProduct, getProduct } from "@/lib/firestore"
import { CreateProductInput } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, MoreHorizontal } from "lucide-react"
import { SignUp } from "@/components/Auth"
interface state{
  id:"string",
  name:"string"

}

export default function SubmitProduct() {
  const params = useParams();
  const action = params.action as string;
  const id = params.id as string | undefined;

  // Set button text based on action
  const [button, setButton] = useState<string>("Create");
  let text
  useEffect(()=>{
    setButton(action === "update" ? "Update" : "Create");
    if (action === "update"){
      text="Update"
    }
    else{
      text="Create"
    }

  },[action])
  
 
  const [formData, setFormData] = useState<CreateProductInput>({
    name: "",
    description: "",
    url: "",
    tags: [],
    image:""
  })
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")
  const [showSignUp, setShowSignUp] = useState(false);
  const [originalProduct, setOriginalProduct] = useState<CreateProductInput | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading: authLoading, error, signInWithGoogle, signInWithGithub } = useFirebaseAuth();
  const router = useRouter()

  useEffect(() => {
    if (action === "update" && id) {
      getProduct(id).then((product) => {
        if (product) {
          setOriginalProduct(product);
          setFormData({
            name: product.name ?? "",
            description: product.description ?? "",
            url: product.url ?? "",
            tags: Array.isArray(product.tags) ? product.tags : [],
            image: product.image ?? ""
          });
        }
      });
    }
  }, [action, id]);

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

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const url = `https://api.cloudinary.com/v1_1/dinhnncvj/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned");
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url || null;
  };

  const handleProductImageUpload = async (file: File) => {
    setUploadError(null);
    // Optionally validate file type/size here
    const url = await uploadToCloudinary(file);
    if (url) {
      console.log("image uploaded")
      setProductImage(url);
    } else {
      setUploadError("Failed to upload image to Cloudinary");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProductImageUpload(file);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setSubmitStatus("error");
      setSubmitMessage("Please sign in to submit a product");
      return;
    }

    if (button === "Create" && (!formData.name.trim() || !formData.description.trim() || !formData.url.trim())) {
      setSubmitStatus("error");
      setSubmitMessage("Please fill in all required fields");
      return;
    }

    if (button === "Create") {
      // create logic
      try {
        setIsSubmitting(true);
        setSubmitStatus("idle");
        const productData = { ...formData, image: productImage || formData.image || "" };
        const productId = await createProduct(productData, user.uid);
        setSubmitStatus("success");
        setSubmitMessage("Product submitted successfully!");
        router.push(`/products/${productId}`);
      } catch (err) {
        setSubmitStatus("error");
        setSubmitMessage("Failed to submit product. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else if (button === "Update" && id) {
      if (!originalProduct) return; // Wait for original data

      // Build an object with only changed fields
      const changedFields: Partial<CreateProductInput> = {};
      (Object.keys(formData) as (keyof CreateProductInput)[]).forEach((key) => {
        if (key === "tags") {
          if (JSON.stringify(formData.tags) !== JSON.stringify(originalProduct.tags)) {
            changedFields.tags = formData.tags;
          }
        } else if (key === "image") {
          // Use productImage if set, otherwise formData.image
          const newImage = productImage || formData.image || "";
          if (newImage !== originalProduct.image) {
            changedFields.image = newImage;
          }
        } else if (formData[key] !== originalProduct[key]) {
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        alert("No changes to update.");
        return;
      }

      try {
        await updateProduct(id, user.uid, changedFields);
        alert("Product updated!");
      } catch (err) {
        alert("Failed to update product.");
      }
    }
  }, [formData, user, router, button, id, originalProduct, productImage]);

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
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-6">
              You need to be signed in to submit a product. Please sign in with Google or GitHub to continue.
            </p>
            <button 
              onClick={() => setShowSignUp(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        {showSignUp && (
          <SignUp
            setClicked={setShowSignUp}
            clicked={showSignUp}
            error={error}
            loading={authLoading}
            signInWithGoogle={signInWithGoogle}
            signInWithGithub={signInWithGithub}
          />
        )}
      </>
    );
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
            <div className="mb-6 flex flex-col items-center">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {productImage ? (
                  <img src={productImage} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">Upload Image</span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {uploadError && <div className="text-red-500 mt-2">{uploadError}</div>}
            </div>

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
                required={button === "Create"}
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
                required={button === "Create"}
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
                required={button === "Create"}
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
              {isSubmitting ? "Submitting..." : `${button}`}
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
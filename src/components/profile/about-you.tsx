"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Info, Upload, X, Camera } from "lucide-react"

export default function AboutYou() {
  const [formData, setFormData] = useState({
    name: "Jone smith",
    username: "jone_smith",
    email: "jonesmith@gmail.com",
    linkedin: "",
    xcom: "",
    headline: "",
  })

  const [headlineCount, setHeadlineCount] = useState(0)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "headline") {
      setHeadlineCount(value.length)
    }
  }

  const validateImage = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)"
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return "Image size should be less than 5MB"
    }

    return null
  }

  const handleImageUpload = useCallback((file: File) => {
    setUploadError(null)

    const error = validateImage(file)
    if (error) {
      setUploadError(error)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileImage(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageUpload(files[0])
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Tell us more about yourself</h1>

      <div className="space-y-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            {/* Image Upload Area */}
            <div
              className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "ring-4 ring-blue-500 ring-opacity-50 scale-105"
                  : "ring-2 ring-gray-200 hover:ring-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              {profileImage ? (
                <>
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </>
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center transition-colors duration-200 ${
                    isDragging ? "bg-blue-50" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {isDragging ? (
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                  ) : (
                    <User className="w-16 h-16 text-white mb-2" />
                  )}
                  {isDragging && <span className="text-sm text-blue-600 font-medium">Drop image here</span>}
                </div>
              )}
            </div>

            {/* Remove button */}
            {profileImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage()
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Instructions */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Recommended size: 400x400px</p>
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Username */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <Info className="w-4 h-4 text-blue-500" />
            </div>
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <Input
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* X.com */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">X.com</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
              </div>
              <Input
                value={formData.xcom}
                onChange={(e) => handleInputChange("xcom", e.target.value)}
                placeholder="https://www.x.com/@..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Headline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Headline</label>
              <span className="text-sm text-gray-500">{headlineCount}/40</span>
            </div>
            <Textarea
              value={formData.headline}
              onChange={(e) => handleInputChange("headline", e.target.value)}
              placeholder="Example: Co-founder and storyteller. Building a social app."
              maxLength={40}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  )
}

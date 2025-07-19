"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CardContent,Card } from "../ui/card"
import { User, Info, Upload, X, Camera, Linkedin, Twitter } from "lucide-react"
import { updateUser } from '@/lib/firestore';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import Image from 'next/image';


export  default function AboutYou() {
   
  const { user } = useFirebaseAuth();
    
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    linkedin: "",
    xcom: "",
    headline: "",
  })

  const [headlineCount, setHeadlineCount] = useState(0)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Prefill form fields from user on mount or when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        linkedin: user.linkedin || "",
        xcom: user.xcom || "",
        headline: user.headline || "",
      });
      if (user.profilePic) setProfileImage(user.profilePic);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "headline") {
      setHeadlineCount(value.length)
    }
  }

  const validateImage = (file: File): string | null => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)"
    }
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return "Image size should be less than 5MB"
    }
    return null
  }

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

  const handleImageUpload = useCallback(async (file: File) => {
    setUploadError(null)
    const error = validateImage(file)
    if (error) {
      setUploadError(error)
      return
    }
    // Upload to Cloudinary
    const cloudUrl = await uploadToCloudinary(file)
    if (cloudUrl && user) {
      await updateUser(user.uid, { profilePic: cloudUrl })
      setProfileImage(cloudUrl)
    } else {
      setUploadError("Failed to upload image to Cloudinary")
    }
  }, [user])

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
 
  // Save handler for all fields
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateUser(user.uid, { ...formData });
      // Optionally show a success message
      alert("Profile updated!");
      // Optionally refetch user data here if you want to ensure it's fresh
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-purple-600 pt-10 via-pink-500 to-blue-500  pb-32">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Tell us about yourself</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Help us create your perfect profile by sharing some details about who you are
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-20 max-w-4xl flex mx-auto px-6 pb-16">
    
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-12">
              <div className="relative group mb-6">
                <div
                  className={`relative w-40 h-40 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "ring-4 ring-blue-500 ring-opacity-50 scale-105 shadow-2xl"
                      : "ring-4 ring-white shadow-xl hover:shadow-2xl hover:scale-105"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  {profileImage ? (
                    <>
                      <Image
                        src={profileImage || "/logo.jpg"}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                    </>
                  ) : (
                    <div
                      className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${
                        isDragging
                          ? "bg-gradient-to-br from-blue-100 to-purple-100"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300"
                      }`}
                    >
                      {isDragging ? (
                        <>
                          <Upload className="w-12 h-12 text-blue-500 mb-3" />
                          <span className="text-sm text-blue-600 font-medium">Drop image here</span>
                        </>
                      ) : (
                        <>
                          <User className="w-20 h-20 text-gray-400 mb-3" />
                          <span className="text-sm text-gray-500 font-medium">Upload Photo</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {profileImage && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">Recommended: 400x400px, max 5MB (JPEG, PNG, WebP)</p>
              </div>

              {uploadError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl max-w-md">
                  <p className="text-sm text-red-600 text-center">{uploadError}</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Form Fields */}
            <div className="grid gap-8 md:gap-10">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                  Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-semibold text-gray-700">Username</label>
                      <Info className="w-4 h-4 text-blue-500" />
                    </div>
                    <Input
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Choose a unique username"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Social Links Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">Social Links</h2>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">LinkedIn Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </div>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                      placeholder="https://www.linkedin.com/in/your-profile"
                      className="h-12 pl-12 pr-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* X.com */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">X (Twitter) Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
                        <Twitter className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <Input
                      value={formData.xcom}
                      onChange={(e) => handleInputChange("xcom", e.target.value)}
                      placeholder="https://www.x.com/@your-handle"
                      className="h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-3">About You</h2>

                {/* Headline */}
                <div className="space-y-2 flex flex-col items-center">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700">Professional Headline</label>
                    <span className={`text-sm font-medium ${headlineCount > 35 ? "text-orange-500" : "text-gray-500"}`}>
                      {headlineCount}/40
                    </span>
                  </div>
                  <Textarea
                    value={formData.headline}
                    onChange={(e) => handleInputChange("headline", e.target.value)}
                    placeholder="Example: Co-founder and storyteller. Building a social app that connects communities."
                    maxLength={40}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Write a brief description that captures who you are professionally
                  </p>
                  <button type="submit" className="p-2 pl-6 pr-6 border   border-purple-500 rounded-xl" onClick={handleSave}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  
}

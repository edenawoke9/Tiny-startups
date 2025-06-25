"use client"

import { useState } from "react"
import { Eye } from "lucide-react"

export default function Newsletter() {
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true)

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Stay ahead of the curve.</h1>
      <p className="text-gray-600 mb-8">Join other successful builders reading about the best</p>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👑</span>
            <h3 className="text-xl font-semibold text-gray-900">The Leaderboard</h3>
          </div>
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Recommended
          </span>
        </div>

        <p className="text-gray-600 mb-4">The Daily: Three takes, ten top launches, one fast summary</p>

        <div className="flex items-center space-x-2 mb-6">
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">1.3M+</span> Readers and you
          </span>
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="newsletter-subscription"
            checked={newsletterSubscribed}
            onChange={(e) => setNewsletterSubscribed(e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-0.5"
          />
          <label htmlFor="newsletter-subscription" className="text-gray-700 cursor-pointer">
            Yes, send me one no-fluff launch email every day
          </label>
        </div>
      </div>
    </>
  )
}

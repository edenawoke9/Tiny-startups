"use client"

import { useState } from "react"
import Image from 'next/image';

interface UserProfile {
  id: string
  name: string
  company: string
  companyIcon: string
  companyColor: string
  description: string
  followers: string
  avatar: string
  isFollowing?: boolean
}

const users: UserProfile[] = [
  {
    id: "1",
    name: "Ben Lang",
    company: "Notion",
    companyIcon: "N",
    companyColor: "bg-black",
    description: "next play",
    followers: "14K followers",
    avatar: "/placeholder.svg?height=60&width=60",
    isFollowing: false,
  },
  {
    id: "2",
    name: "Aaron O'Leary",
    company: "Product Hunt",
    companyIcon: "P",
    companyColor: "bg-red-500",
    description: "Content @ Product Hunt",
    followers: "3K followers",
    avatar: "/placeholder.svg?height=60&width=60",
    isFollowing: false,
  },
  {
    id: "3",
    name: "Dani Grant",
    company: "Jam",
    companyIcon: "J",
    companyColor: "bg-purple-600",
    description: "CEO @ Jam.dev ~ 1-click bug reports 🚀",
    followers: "2.7K followers",
    avatar: "/placeholder.svg?height=60&width=60",
    isFollowing: false,
  },
  {
    id: "4",
    name: "Rajiv Ayyangar",
    company: "Product Hunt",
    companyIcon: "P",
    companyColor: "bg-red-500",
    description: "CEO at Product Hunt",
    followers: "3.4K followers",
    avatar: "/placeholder.svg?height=60&width=60",
    isFollowing: false,
  },
  {
    id: "5",
    name: "Chris Messina",
    company: "Raycast",
    companyIcon: "R",
    companyColor: "bg-red-600",
    description: "Product Designer & Developer Advocate",
    followers: "2.1K followers",
    avatar: "/placeholder.svg?height=60&width=60",
    isFollowing: false,
  },
]

export default function FindFollowers() {
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set())

  const handleFollow = (userId: string) => {
    setFollowingUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">People to follow</h1>
        <p className="text-lg text-gray-600">
          Follow people to personalize your feed with products they hunt and make.
        </p>
      </div>

      <div className="space-y-4">
        {users.map((user) => {
          const isFollowing = followingUsers.has(user.id)

          return (
            <div
              key={user.id}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all duration-200 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar with hover effect */}
                  <div className="relative">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={60}
                      height={60}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name and Company */}
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                      <div className="flex items-center space-x-2 bg-gray-50 px-2.5 py-1 rounded-full">
                        <div
                          className={`w-4 h-4 ${user.companyColor} ${
                            user.companyIcon === "N" ? "rounded" : "rounded-full"
                          } flex items-center justify-center shadow-sm`}
                        >
                          <span className="text-white text-xs font-bold">{user.companyIcon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{user.company}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {user.description && <p className="text-gray-600 text-sm mb-2 line-clamp-2">{user.description}</p>}

                    {/* Followers count */}
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-500">{user.followers}</span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isFollowing
                      ? "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-md"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-500"
                  }`}
                >
                  {isFollowing ? (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Following</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span>Follow</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200">
          Load more people
        </button>
      </div>
    </div>
  )
}

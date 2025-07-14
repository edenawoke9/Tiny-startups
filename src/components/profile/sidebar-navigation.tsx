"use client"

import { User, Mail, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { ArrowLeftCircle } from "lucide-react"

interface SidebarNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export default function SidebarNavigation({ activeSection, onSectionChange }: SidebarNavigationProps) {
  const router=useRouter()
  const navigationItems = [
    {
      id: "about",
      label: "About you",
      icon: User,
    },
    {
      id: "newsletter",
      label: "Newsletter",
      icon: Mail,
    },
    {
      id: "followers",
      label: "Find followers",
      icon: Users,
    },
  ]

  return (
    <div className="w-full h-screen bg-white pt-10">
      <button onClick={()=>{router.push("/")}}>
        <ArrowLeftCircle/>
      </button>
      <div className="p-6">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <div
                key={item.id}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer ${
                  isActive ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className={`font-medium ${isActive ? "text-gray-900" : "text-gray-600"}`}>{item.label}</span>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

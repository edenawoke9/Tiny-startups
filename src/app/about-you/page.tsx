"use client"

import { useState } from "react"
import SidebarNavigation from "@/components/profile/sidebar-navigation"
import AboutYou from "@/components/profile/about-you"
import Newsletter from "@/components/profile/newsletter"
import FindFollowers from "@/components/profile/find-followers"


export default function Component() {
  const [activeSection, setActiveSection] = useState("about")

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return <AboutYou />
      case "newsletter":
        return <Newsletter />
      case "followers":
        return <FindFollowers />
      default:
        return <AboutYou />
    }
  }

  return (
    <div className="h-screen flex pt-16 bg-gray-50 ">
      {/* Sidebar: fixed height and not scrollable */}
      <div className="w-[30%] pl-10 bg-white   h-full flex-shrink-0">
        <SidebarNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content: scrollable vertically */}
      <div className="flex-1 overflow-y-auto py-8 ">
        <div className="max-w-[90%] mx-auto">{renderContent()}</div>
      </div>
    </div>
  )
}

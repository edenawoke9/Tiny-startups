"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"

import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth"

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [authClicked, setAuthClicked] = useState(false);
   

return (
    <div className="flex  justify-between w-full">
      <div
        className={`
          fixed flex justify-between items-center p-4 z-[100] w-full
          bg-white/95 backdrop-blur-md border border-gray-200/50 text-black
          transition-all duration-300 ease-in-out 
         
        `}
      >
        <div>
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r  from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            <Image src="/logo.jpg" width={40} height={40} alt="logo"/>
          </Link>
            </div>
            <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 hover:text-gray-900">
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full h-full bg-white backdrop-blur-md border border-gray-200/50 text-black">
                    <Nav authClicked={authClicked} setAuthClicked={setAuthClicked} />
                </div>
            )}
        
      </div>
    </div>
  );
}

export function Nav({ authClicked, setAuthClicked }: { authClicked: boolean; setAuthClicked: (value: boolean) => void }){
    const pathname = usePathname();
    const { user, signOut } = useFirebaseAuth();
    const names = user?.name?.split(" ") || [];

    return<>
    <div className="flex flex-col bg-white items-left pl-2 gap-8">
          <nav className="flex flex-col gap-2 ">
            <Link
              href="/myProducts"
              className={`
                relative px-4 py-2 rounded-xl font-medium transition-all duration-200
                hover:bg-gray-100 
                ${pathname === "/launches"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
                }
              `}
              style={{ overflow: "hidden" }}
            >
              My Products
             
            </Link>
            
            <Link
              href="/newsletter"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 ${
                pathname === "/newsletter"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Newsletter
            </Link>
            <Link
              href="/community"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 ${
                pathname === "/community"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Community
            </Link>
          </nav>

          <div className="flex  gap-3">
            <Link href="/submit-product/launch" className="group animated-button1 bg-white text-gray-700 flex items-center border bg-gradient-to-r from-[#e14eca] to-[#3b82f6]  rounded-xl  p-[2px]">
              <div className="bg-white flex pl-4 pr-4 w-full h-full items-center rounded-xl">
               <div className="text-xl pr-2">
  +
</div>
                Launch
                <span />
                <span />
                <span />
                <span />
              </div>
            </Link>
            
            {/* Mobile Auth Component */}
            <div className="relative">
              <button
                onClick={() => setAuthClicked(!authClicked)}
                className="relative rounded-xl font-medium text-gray-700 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {user ? (
                  <span>
                    <Image
                      src={user.profilePic || user.photoURL || "/logo.jpg"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover w-8 h-8 rounded-full"
                    />
                  </span>
                ) : (
                  <h1 className="p-2 pr-4 pl-4 rounded-xl shadow-sm">Sign Up</h1>
                )}
              </button>

              {/* Mobile Auth Dropdown */}
              {authClicked && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[200px] z-50">
                  {!user ? (
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3">Please sign in to continue</p>
                      <Link href="/login" className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                        Sign In
                      </Link>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={user.profilePic || user.photoURL || "/logo.jpg"}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="object-cover w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{names[0] || user.displayName || 'User'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Link 
                          href="/about-you" 
                          onClick={() => setAuthClicked(false)}
                          className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setAuthClicked(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div></>
}

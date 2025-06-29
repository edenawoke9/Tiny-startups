"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Auth from "../Auth"

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="flex justify-center">
      <div
        className={`
          fixed flex justify-between items-center p-4 z-[100]
          bg-white/95 backdrop-blur-md border border-gray-200/50 text-black
          transition-all duration-300 ease-in-out
          ${
            scrolled
              ? "max-w-6xl w-[90%] top-4 rounded-2xl shadow-xl left-1/2 -translate-x-1/2 border-gray-300/30"
              : "w-full top-0 rounded-none shadow-sm"
          }
        `}
      >
        <div>
          <Link
            href="/"
            className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            Logo
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex gap-2">
            <Link
              href="/launches"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 ${
                pathname === "/launches"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Launches
            </Link>
            <Link
              href="/products"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:bg-gray-100 ${
                pathname === "/products"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Products
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

          <div className="flex gap-3">
            <button className="group bg-white text-gray-700 flex items-center border border-gray-200 gap-3 px-5 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white hover:border-gray-800 transition-all duration-300 shadow-sm hover:shadow-md font-medium">
              <div className="h-5 w-5 flex items-center justify-center rounded-full border border-gray-300 group-hover:border-white transition-colors duration-300 text-sm font-bold">
                +
              </div>
              Launch
            </button>
            <Auth/>
          </div>
        </div>
      </div>
    </div>
  );
}

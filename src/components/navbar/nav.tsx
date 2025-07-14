"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Auth from "../Auth"
import Image from "next/image"

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
    <div className="flex  justify-center">
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
            className="font-bold text-2xl bg-gradient-to-r  from-orange-500 to-pink-500 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            <Image src="/logo.jpg" width={40} height={40} alt="logo"/>
          </Link>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex gap-2 ">
            <Link
              href="/launches"
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
              Launches
             
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
            <Link href="/submit-product" className="group animated-button1 bg-white text-gray-700 flex items-center border bg-gradient-to-r from-[#e14eca] to-[#3b82f6]  rounded-xl  p-[2px]">
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
            <Auth/>
          </div>
        </div>
      </div>
    </div>
  );
}

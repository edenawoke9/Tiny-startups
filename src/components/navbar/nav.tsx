'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";




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

       
        window.addEventListener('scroll', handleScroll);

        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]); 

    return (
       
        <div className="flex justify-center">
            <div
                className={`
                    fixed flex justify-between items-center p-4
                    bg-white border-b border-zinc-100 text-black
                    transition-all  duration-0
                    ${scrolled
                       
                        ? 'max-w-6xl w-[90%] top-4 rounded-xl shadow-lg left-1/2 -translate-x-1/2  `'
                       
                        : 'w-full top-0'
                    }
                `}
            >
                <div>
                    <Link href="/" className="font-bold text-xl">
                        Logo
                    </Link>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="flex gap-6">
                       
                        <Link href="/launches" className={`p-2 ${pathname === '/launches' ? 'bg-green-200 rounded-lg' : ''}`}>Launches</Link>
                        <Link href="/products" className={`p-2 ${pathname === '/products' ? 'bg-green-200 rounded-lg' : ''}`}>Products</Link>
                        <Link href="/newsletter" className={`p-2 ${pathname === '/newsletter' ? 'bg-green-200 rounded-lg' : ''}`}>Newsletter</Link>
                        <Link href="/community" className={`p-2 ${pathname === '/community' ? 'bg-green-200 rounded-lg' : ''}`}>Community</Link>
                    </nav>
                    <div className="flex gap-4">
                        <button className="bg-white text-black flex items-center border-zinc-200 border gap-4 px-4 py-2 rounded-lg hover:text-white hover:bg-slate-700">
                           <h1 className=" h-5 w-5 flex items-center justify-center rounded-full border border-zinc-200">+</h1> Launch
                        </button>
                        <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
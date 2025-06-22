'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

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
                    bg-amber-100 text-black
                    transition-all  duration-0
                    ${scrolled
                       
                        ? 'max-w-4xl w-[90%] top-4 rounded-xl shadow-lg left-1/2 -translate-x-1/2'
                       
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
                       
                        <Link href="/launches">Launches</Link>
                        <Link href="/products">Products</Link>
                        <Link href="/newsletter">Newsletter</Link>
                        <Link href="/community">Community</Link>
                    </nav>
                    <div className="flex gap-4">
                        <button className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700">
                            Launch
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
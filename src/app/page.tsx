"use client"

import { useState, useRef } from "react"
import { getYear, getMonth, format, startOfMonth, endOfMonth } from "date-fns"
import Products from "./products/products"
import RightCom from "../components/rightCom"
import Header from "@/components/navbar/nav"
import { MoveRight, MoveLeft } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex pl-24 pr-24 pt-28 gap-10 h-screen justify-between bg-white w-full">
        <div className=" rounded-md p-6 w-fit flex flex-col min-w-0 text-black font-sans">
          <div>
            <h1 className="text-3xl font-semibold">
              Welcome To{" "}
              <span className="bg-gradient-to-r from-[#e14eca] to-[#3b82f6] bg-clip-text text-transparent">
                Tiny Startups
              </span>
            </h1>
            <p className="text-gray-500 text-xl">The launch platform for your tiny startups and side projects</p>
          </div>

          <div className="border-t border-zinc-200 mt-4">
            <MonthList />
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          <RightCom />
        </div>
      </div>
    </div>
  )
}

export function MonthList() {
  const year = getYear(new Date())
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i
    const dateForMonth = new Date(year, monthNum, 1)
    const startDate = startOfMonth(dateForMonth)
    const endDate = endOfMonth(dateForMonth)

    return {
      month: monthNum,
      name: format(dateForMonth, "MMMM"),
      range: `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`,
    }
  })

  const [ActiveMonth, setMonth] = useState(months[getMonth(new Date())])
  const scrollContainer = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="z-30">
      <div className="flex items-center gap-2 text-sm mt-4">
        <button
          onClick={() => scroll("left")}
          className="p-2 text-xl text-gray-400 hover:text-black transition-colors duration-200"
        >
          <MoveLeft />
        </button>
        <div
          ref={scrollContainer}
          className="flex overflow-x-auto scroll-smooth items-center gap-x-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {months.map((month) => (
            <div
              key={month.month}
              className={`flex-shrink-0 ${ActiveMonth.month === month.month ? "bg-green-100 rounded-lg" : ""}`}
            >
              <button
                onClick={() => setMonth(month)}
                className={`whitespace-nowrap px-3 py-1.5 font-semibold transition-colors duration-200 ${
                  ActiveMonth.month === month.month ? "text-green-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {month.name}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="p-2 text-xl text-gray-400 hover:text-black transition-colors duration-200"
        >
          <MoveRight />
        </button>
      </div>
      <Products ActiveMonth={ActiveMonth} />
    </div>
  )
}

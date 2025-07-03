"use client"

import { useState, useRef } from "react"
import { getYear, getISOWeeksInYear, setISOWeek, startOfISOWeek, endOfISOWeek, format } from "date-fns"
import Products from "./products/products"
import RightCom from "../components/rightCom"
import Header from "@/components/navbar/nav"
import { MoveRight, MoveLeft } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="flex pl-24 pr-24 pt-28 gap-10 h-screen justify-between bg-white w-full">
        <div className="bg-[#fafafa] rounded-md p-6 w-fit flex flex-col min-w-0 text-black font-sans">
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
            <WeekList />
          </div>
        </div>

        <div className="flex-1 hidden md:flex justify-center">
          <RightCom />
        </div>
      </div>
    </div>
  )
}

export function WeekList() {
  const year = getYear(new Date())
  const weeksInYear = getISOWeeksInYear(new Date())
  const weeks = Array.from({ length: weeksInYear }, (_, i) => {
    const weekNum = i + 1
    const dateForWeek = setISOWeek(new Date(year, 0, 4), weekNum)
    const startDate = startOfISOWeek(dateForWeek)
    const endDate = endOfISOWeek(dateForWeek)

    return {
      week: weekNum,
      range: `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`,
    }
  })

  const [ActiveWeek, setWeek] = useState(weeks[1])
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
          {weeks.map((week) => (
            <div
              key={week.week}
              className={`flex-shrink-0 ${ActiveWeek.week === week.week ? "bg-green-100 rounded-lg" : ""}`}
            >
              <button
                onClick={() => setWeek(week)}
                className={`whitespace-nowrap px-3 py-1.5 font-semibold transition-colors duration-200 ${
                  ActiveWeek.week === week.week ? "text-green-700" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Week {week.week}
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
      <Products ActiveWeek={ActiveWeek} />
    </div>
  )
}

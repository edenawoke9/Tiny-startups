'use client';
import React, { useState, useRef } from "react";
import { getYear, getISOWeeksInYear, setISOWeek, startOfISOWeek, endOfISOWeek, format } from 'date-fns';
import Products from "../components/products/products";
import RightCom from "../components/rightCom";
import Header from "@/components/navbar/nav";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div><Header/></div>
    <div className="flex  pl-24 pr-24 pt-28  gap-10  h-screen justify-between bg-white w-full">
    <div className="bg-[#fafbfc] text-4xl w-fit flex flex-col min-w-0 text-black font-sans">
      <div>
        <h1>Welcome To <span className="bg-gradient-to-r from-[#e14eca] to-[#3b82f6] bg-clip-text text-transparent">Tiny Startups</span></h1>
        <p className="text-gray-500 text-xl">The launch platfrom for your tiny startups and side projects</p>
      </div>
      <div className="border-t mt-4  ">
        <WeekList />
        
      </div>
      
    </div>
   
    <div className="flex-1 flex justify-center">
      <RightCom />
    </div>
    </div></div>
  );
}

export function WeekList(){
 
  const year=getYear(new Date());
  const weeksInYear=getISOWeeksInYear(new Date())
  const weeks=Array.from({length:weeksInYear},(_,i)=>{
    let weekNum=i+1
    const dateForWeek = setISOWeek(new Date(year, 0, 4), weekNum);
    const startDate = startOfISOWeek(dateForWeek);
    const endDate = endOfISOWeek(dateForWeek);
    
    return {
      week: weekNum,
      range: `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`,
    }
  });
  const [ActiveWeek,setWeek] = useState(weeks[22]);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return(
    <div >
      <div className="flex items-center gap-2 text-sm mt-4">
       <button onClick={() => scroll('left')} className="p-2 text-xl text-gray-400 hover:text-black">
        {'<'}
      </button>
      <div ref={scrollContainer} className="flex overflow-x-auto scroll-smooth items-center gap-x-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {weeks.map((week) => (
        <div key={week.week} className={`flex-shrink-0 ${ActiveWeek.week === week.week ? 'bg-green-100 rounded-lg' : ''}`}>
          <button onClick={()=>setWeek(week)} className={`whitespace-nowrap px-3 py-1.5 font-semibold ${ActiveWeek.week === week.week ? 'text-green-700' : 'text-gray-500'}`}>
            Week {week.week}
            </button>
        </div>
      ))}
      </div>
       <button onClick={() => scroll('right')} className="p-2 text-xl text-gray-400 hover:text-black">
        {'>'}
      </button>
      </div>
      <Products ActiveWeek={ActiveWeek} />
    </div>
  );
}

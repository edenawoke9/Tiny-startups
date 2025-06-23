'use client';
import React from 'react';
import { useRouter} from 'next/navigation';
import products from '@/lib/products.json';
const startups = products.startups;
const moreStartups = products.moreStartups;


const featured = [
  {
    name: "Social Intents",
    desc: "AI Chatbots backed by your team in Microsoft Teams, Slack, and Google Chat.",
  },
  {
    name: "Capgo",
    desc: "Instant updates for Capacitor. Ship updates, fixes, changes, and features...",
  },
  {
    name: "ServerScheduler",
    desc: "Slash cloud costs with server scheduling. AWS, GCP, Azure.",
  },
  {
    name: "Startups.fm",
    desc: "",
  },
];

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
);

const UpvoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 4-6 7h12z"/>
    </svg>
);


const StartupItem = ({ startup }: { startup: any }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm w-3xl flex items-center gap-x-4 ">
        {startup.icon &&
            <div className="bg-gray-100 p-2 rounded-lg text-2xl h-12 w-12 flex items-center justify-center flex-shrink-0">
                {startup.icon}
            </div>
        }

        <div className="flex-grow">
            <div className="flex items-center gap-x-2">
                <h3 className="font-bold text-base">{startup.name}</h3>
                {startup.promoted && (
                    <span className="flex items-center gap-x-1 text-xs text-yellow-700 font-semibold bg-yellow-100 px-2 py-1 rounded-md whitespace-nowrap">
                        <StarIcon />
                        Promoted
                    </span>
                )}
            </div>
            <p className="text-gray-500 text-sm mt-1">{startup.desc}</p>
        </div>

        {(startup.votes !== null && startup.votes !== undefined) && (
            <div className="flex flex-col items-center justify-center border border-zinc-200 rounded-lg p-2 w-16 h-16 flex-shrink-0">
                <UpvoteIcon />
                <p className="text-sm font-semibold">{startup.votes}</p>
            </div>
        )}
    </div>
);

export default function Products({ActiveWeek}:{ActiveWeek:any}){
    const router = useRouter();
    const handleClick = (startup: any) => {
      let name= startup.name
        router.push(`/products/${name}`);
    }
    return(
        <div>
            <div className="flex justify-between  items-center py-4 mt-4">
                <div>
                <h2 className="text-2xl font-serif">Week {ActiveWeek.week}</h2>
                <p className="text-base text-gray-500">{ActiveWeek.range}</p>
                </div>
                <button className="border border-green-600 text-green-600 font-bold  px-5 rounded-lg flex items-center gap-x-2 text-base">
                <span>Launch</span>
                <span className="text-xl">&rarr;</span>
                </button>
            </div>

            <div className="space-y-4 mt-4">
            {startups.map((startup, index) => (
              <button key={index} onClick={() => handleClick(startup)}> <StartupItem key={index} startup={startup} /></button>
            ))}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Featured this week</h2>
                <div className="space-y-4">
                    {featured.map((startup, index) => (
                      <button key={index} onClick={() => handleClick(startup)}> <StartupItem key={index} startup={startup} /></button>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">More from this week</h2>
                <div className="space-y-4">
                    {moreStartups.map((startup, index) => (
                      <button key={index} onClick={() => handleClick(startup)}> <StartupItem key={index} startup={startup} /></button>
                    ))}
                </div>
            </div>
      </div>
    )
}
'use client';
import React from 'react';

const startups = [
  {
    name: "GrayBlocks",
    desc: "2700+ blocks & components to build premium websites without code.",
    icon: "🟪",
    promoted: true,
    votes: null,
  },
  {
    name: "Endorsely",
    desc: "Grow your MRR with the #1 free affiliate marketing software for SaaS.",
    icon: "⭐",
    promoted: true,
    votes: null,
  },
  {
    name: "Brilliant Design",
    desc: "Turn any screen into figma.",
    icon: "🌈",
    promoted: false,
    votes: 78,
  },
  {
    name: "Lorelight",
    desc: "AI brand monitoring across ChatGPT, Claude & Gemini",
    icon: "🌟",
    promoted: false,
    votes: 70,
  },
];

const moreStartups = [
  {
    name: "Brilliant Design",
    desc: "Turn any screen into figma.",
    icon: "🌈",
    votes: 78,
  },
  {
    name: "Lorelight",
    desc: "AI brand monitoring across ChatGPT, Claude & Gemini",
    icon: "🌟",
    votes: 70,
  },
  {
    name: "Chatform",
    desc: "100% AI-powered forms. Chat or share your website to instantly...",
    icon: "🗨️",
    votes: 69,
  },
  {
    name: "BlogMaker",
    desc: "Create beautiful SEO ready blogs in minutes.",
    icon: "📝",
    votes: 66,
  },
  {
    name: "Audioread",
    desc: "Turn any text into natural audio in 80+ languages.",
    icon: "🔊",
    votes: 59,
  },
  {
    name: "Pagetune",
    desc: "Enter your URL and get a stunning, AI-powered redesign in...",
    icon: "🌀",
    votes: 58,
  },
];

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
    <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-x-4 w-full">
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
            <div className="flex flex-col items-center justify-center border rounded-lg p-2 w-16 h-16 flex-shrink-0">
                <UpvoteIcon />
                <p className="text-sm font-semibold">{startup.votes}</p>
            </div>
        )}
    </div>
);

export default function Products({ActiveWeek}:{ActiveWeek:any}){
    return(
        <div>
            <div className="flex justify-between items-center py-4 mt-4">
                <div>
                <h2 className="text-3xl font-serif">Week {ActiveWeek.week}</h2>
                <p className="text-base text-gray-500">{ActiveWeek.range}</p>
                </div>
                <button className="border border-green-600 text-green-600 font-bold py-2 px-5 rounded-lg flex items-center gap-x-2 text-base">
                <span>Launch</span>
                <span className="text-xl">&rarr;</span>
                </button>
            </div>

            <div className="space-y-4 mt-4">
            {startups.map((startup, index) => (
                <StartupItem key={index} startup={startup} />
            ))}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Featured this week</h2>
                <div className="space-y-4">
                    {featured.map((startup, index) => (
                        <StartupItem key={index} startup={startup} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">More from this week</h2>
                <div className="space-y-4">
                    {moreStartups.map((startup, index) => (
                        <StartupItem key={index} startup={startup} />
                    ))}
                </div>
            </div>
      </div>
    )
}
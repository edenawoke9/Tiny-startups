import React from 'react';

const featured = [
  {
    name: "Social Intents",
    desc: "AI Chatbots backed by your team in Microsoft Teams, Slack, and Google Chat.",
    icon: '💬'
  },
  {
    name: "Capgo",
    desc: "Instant updates for Capacitor. Ship updates, fixes, changes, and features...",
    icon: '⚡️'
  },
  {
    name: "ServerScheduler",
    desc: "Slash cloud costs with server scheduling. AWS, GCP, Azure.",
    icon: '⏰'
  },
  {
    name: "Startups.fm",
    desc: "The podcast for bootstrapped founders.",
    icon: '🎙️'
  },
];

const SpeakerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 h-6 w-6">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>
);

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400 h-7 w-7">
        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 4.517 1.48-8.279-6.064-5.828 8.332-1.151z"/>
    </svg>
);


export default function Sidebar() {
    return (
        <div className="w-full lg:w-80 flex-shrink-0 space-y-8">
            {/* New Launch Card */}
            <div className="p-6 rounded-2xl bg-slate-100/60" style={{backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' rx=\'16\' ry=\'16\' stroke=\'%23CBD5E1FF\' stroke-width=\'1\' stroke-dasharray=\'6%2c 12\' stroke-dashoffset=\'0\' stroke-linecap=\'square\'/%3e%3c/svg%3e")'}}>
                <div className="flex items-center gap-x-2">
                    <h2 className="text-lg font-bold text-gray-800">What will you launch today?</h2>
                    <SpeakerIcon />
                </div>
                <p className="text-sm text-gray-500 mt-2">Share what you're working on & get featured in-front of <span className="font-bold text-gray-700">17,563</span> founders.</p>
                <div className="mt-5 p-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500 hover:shadow-lg transition-shadow">
                    <button className="bg-white w-full rounded-full px-6 py-2">
                        <span className="font-bold text-base text-gray-800">+ New Launch</span>
                    </button>
                </div>
            </div>

            {/* Featured List */}
            <div className="bg-white border p-6 rounded-2xl w-full shadow-sm">
                <div className="flex items-center gap-x-1">
                    <h2 className="text-xl font-bold">Featured</h2>
                    <StarIcon />
                </div>
                <div className="space-y-5 mt-5">
                    {featured.map((item, index) => (
                        <div key={index} className="flex items-start gap-x-4">
                            <div className="bg-gray-100 border rounded-lg h-10 w-10 flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base">{item.name}</h3>
                                {item.desc && <p className="text-sm text-gray-500">{item.desc}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
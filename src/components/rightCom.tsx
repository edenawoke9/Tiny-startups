import { Star } from "lucide-react";

const featuredItems = [
    {
      icon: <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">g</div>,
      title: "Social Intents",
      description: "AI Chatbots backed by your team in Microsoft Teams, Slack, and Google Chat.",
    },
    {
      icon: <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center p-1">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L100 50L50 100L0 50L50 0Z" fill="black"/>
              <path d="M50 15L85 50L50 85L15 50L50 15Z" fill="white"/>
              <path d="M50 25L75 50L50 75L25 50L50 25Z" fill="black"/>
              <path d="M50 42L58 50L50 58L42 50L50 42Z" fill="white"/>
          </svg>
      </div>,
      title: "Capgo",
      description: "Instant updates for Capacitor. Ship updates, fixes, changes, and features...",
    },
    {
      icon: <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold tracking-widest">...</div>,
      title: "ServerScheduler",
      description: "Slash cloud costs with server scheduling. AWS, GCP, Azure.",
    },
    {
      icon: <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center text-purple-600 font-bold">S</div>,
      title: "Startups.fm",
      description: "The best place to launch your startup.",
    },
];

export default function RightCom(){
    return (
        <div className="flex  flex-col p-6 gap-6  text-black   border border-zinc-50   bg-white w-fit items-center h-fit  rounded-lg">
<div className="flex flex-col gap-3 bg-[#fafafa] p-6  w-full  rounded-lg">
    <h1 className="text-xl font-semibold whitespace-nowrap" >What will you launch today?</h1>
    <p className="text-sm text-center text-zinc-500">
        share what you'r working on and get featured in-front of 17k founders.
    </p>
    <div className="  text-black bg-gradient-to-r from-[#e14eca] to-[#3b82f6] p-[2px]  rounded-2xl"><button className="bg-white rounded-2xl  w-full">New Launch</button> </div>
    

</div>
<div className="flex flex-col gap-4 w-full bg-[#fafafa] p-4 rounded-lg">
    <h1 className="flex gap-2 text-lg font-semibold">Featured  <Star className="text-yellow-500 "/></h1>
    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
        {featuredItems.map((item, index) => (
            <div key={index} className="flex gap-3 items-center p-2 rounded-xl bg-white border border-zinc-100">
                <div>{item.icon}</div>
                <div className="flex flex-col">
                    <h2 className="font-semibold text-sm">{item.title}</h2>
                    <p className="text-xs text-zinc-500">{item.description}</p>
                </div>
            </div>
        ))}
    </div>
</div>
<div>

</div>
        </div>
    )
}
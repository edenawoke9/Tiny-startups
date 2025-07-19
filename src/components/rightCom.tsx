import { Star } from "lucide-react";
import Link from "next/link";

type FeaturedItem = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
};

const featuredItems: FeaturedItem[] = [];

export default function RightCom(){
    return (
        <div className="flex  flex-col p-6 gap-6  text-black   border border-zinc-50   bg-white w-fit items-center h-fit  rounded-lg">
<div className="flex flex-col gap-3 bg-[#fafafa] p-6  w-full  rounded-lg">
    <h1 className="text-xl font-semibold whitespace-nowrap" >What will you launch today?</h1>
    <p className="text-sm text-center text-zinc-500">
        share what you&apos;r working on and get featured in-front of 17k founders.
    </p>
    <div className="text-black bg-gradient-to-r from-[#e14eca] to-[#3b82f6] p-[2px] animated-button1 rounded-2xl relative overflow-hidden">
  <button  className="bg-white rounded-xl w-full relative z-10"><Link href="/submit-product/launch">New Launch</Link></button >
  <span />
  <span />
  <span />
  <span />
</div>
    

</div>
<div className="flex flex-col gap-4 w-full bg-[#fafafa] p-4 rounded-lg">
    <h1 className="flex gap-2 text-lg font-semibold">Featured  <Star className="text-yellow-500 "/></h1>
    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
        {featuredItems.length > 1
          ? featuredItems.map((item: FeaturedItem, index: number) => (
              <div key={index} className="flex items-start gap-x-4">
                <div className="bg-gray-100 border rounded-lg h-10 w-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                </div>
              </div>
            ))
          : <p>No Featured Products</p>
        }
    </div>
</div>
<div>

</div>
        </div>
    )
}
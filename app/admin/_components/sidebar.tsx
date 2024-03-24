import { Settings } from "lucide-react";
import Image from "next/image";

export const SidebarAdmin = () => {
  return (
    <aside className="w-[15%] h-full border-r border-gray-300 flex flex-col p-2">
      <div className="w-full h-[15%] border-b relative flex flex-col justify-center items-center">
        <Image src="/mascot.svg" width={100} height={100} alt="mascot" />
        <h1 className="text-lg text-green-500 font-bold">DuolingClone</h1>
      </div>
      <div className="w-full h-[85%] overflow-y-auto ">
        <div className="w-full border-b border-gray-300 flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
          <Settings className="text-green-500" size={45} />
          <p className="ml-auto font-bold">Courses</p>
        </div>
      </div>
    </aside>
  );
};

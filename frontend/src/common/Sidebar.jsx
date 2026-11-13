import {
  Home,
  CalendarCheckIcon,
  BookMinusIcon,
  Wallet,
  LucideListTodo,
  StickyNote,
  UserCircleIcon,
} from "lucide-react";
import { useState } from "react";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "calendar", label: "Calendar", icon: CalendarCheckIcon },
  { id: "journal", label: "Journal", icon: BookMinusIcon },
  { id: "expenses", label: "Expenses", icon: Wallet },
  { id: "tasks", label: "Tasks", icon: LucideListTodo },
  { id: "note", label: "Notes", icon: StickyNote },
  { id: "profile", label: "Profile", icon: UserCircleIcon },
];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => t.id === activeTab),
  );

  const ActiveIcon = TABS[activeIndex].icon;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Contextual smooth scrolling based on tab
    if (tabId === "home" || tabId === "calendar") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tabId === "tasks" || tabId === "note" || tabId === "journal") {
      window.scrollTo({ top: window.innerHeight * 0.88, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%]  select-none">
      {/*max-w-15*/}
      {/* Dark Navigation Bar Container */}
      <div className="relative h-16 w-full bg-[#18181b] rounded-3xl shadow-2xl shadow-black/40 border border-white/10 flex items-center justify-between px-1">
        {/* Animated Notch & Floating Bubble Indicator */}
        <div
          className="absolute top-0 left-0 h-full pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
          style={{
            width: `${100 / TABS.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        >
          {/* Smooth Curved Notch (Dips into the bar, matching page background) */}
          <svg
            viewBox="0 0 84 32"
            className="absolute -top-px left-1/2 -translate-x-1/2 w-21 h-8 pointer-events-none"
          >
            <path
              d="M 0 0 C 10 0, 14 4, 18 12 C 24 26, 32 32, 42 32 C 52 32, 60 26, 66 12 C 70 4, 74 0, 84 0 Z"
              fill="#ececec"
            />
          </svg>

          {/* Elevated Floating Circle with Active Icon */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-13 h-13 rounded-full bg-[#242631] border-[4.5px] border-[#ececec] shadow-lg shadow-black/40 flex items-center justify-center">
            <ActiveIcon
              key={activeTab}
              size={22}
              className="text-orange-500 animate-icon-pop"
            />
          </div>
        </div>

        {/* Tab Buttons Grid */}
        <div className="relative z-10 grid grid-cols-7 w-full h-full">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isCurrent = idx === activeIndex;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className="group relative flex flex-col items-center justify-center h-full w-full cursor-pointer focus:outline-none"
                aria-label={tab.label}
              >
                {/* Tooltip on hover */}
                <span className="absolute -top-9 px-2 py-0.5 rounded-md bg-black/85 text-white text-[10px] tracking-wide font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-sm whitespace-nowrap">
                  {tab.label}
                </span>

                {/* Normal icon in bar: fades out when active because it lives in the elevated bubble */}
                <Icon
                  size={20}
                  className={`transition-all duration-300 ${
                    isCurrent
                      ? "opacity-0 scale-50 -translate-y-2 pointer-events-none"
                      : "text-zinc-400 group-hover:text-white group-hover:scale-110 active:scale-90"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

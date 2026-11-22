import {
  BookOpen,
  CalendarCheck,
  FileText,
  House,
  ListChecks,
  Wallet,
  UserRound,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ITEMS = [
  { id: "home",     label: "Home",      Icon: House,         emoji: "🏠", path: "/" },
  { id: "calendar", label: "Calendar",  Icon: CalendarCheck, emoji: "📅", path: "/calendar" },
  { id: "journal",  label: "Journal",   Icon: BookOpen,      emoji: "📖", path: "/journal" },
  { id: "expenses", label: "Expenses",  Icon: Wallet,        emoji: "💳", path: "/expenses" },
  { id: "tasks",    label: "Tasks",     Icon: ListChecks,    emoji: "✅", path: "/" },
  { id: "notes",    label: "Notes",     Icon: FileText,      emoji: "📝", path: "/" },
  { id: "profile",  label: "Profile",   Icon: UserRound,     emoji: "👤", path: "/" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-2xl border border-white/15 dark:border-zinc-800 shadow-2xl shadow-purple-950/30 dark:shadow-black/60 max-w-[95vw]"
      aria-label="Main navigation"
    >
      {ITEMS.map(({ id, label, Icon, emoji, path }, index) => {
        let isActive = false;
        if (id === "home") {
          isActive = pathname === "/";
        } else if (id === "calendar") {
          isActive = pathname === "/calendar";
        } else if (id === "expenses") {
          isActive = pathname.startsWith("/expenses");
        } else if (id === "journal") {
          isActive = pathname.startsWith("/journal");
        } else {
          isActive = false;
        }

        return (
          <div key={id} className="flex items-center">
            <button
              type="button"
              aria-label={`${label} (${emoji})`}
              aria-current={isActive ? "page" : undefined}
              title={`${emoji} ${label}`}
              onClick={() => navigate(path)}
              className={`relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-tr from-purple-600 to-amber-500 text-white shadow-lg shadow-purple-500/40 scale-105"
                  : "text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95"
              }`}
            >
              {/* Micro emoji badge */}
              <span
                className="absolute -top-1 -right-1 text-[11px] leading-none pointer-events-none transition-transform group-hover:scale-125"
                aria-hidden="true"
              >
                {emoji}
              </span>
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
            </button>

            {index < ITEMS.length - 1 && (
              <span className="w-px h-5 bg-white/10 mx-0.5 sm:mx-1" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;

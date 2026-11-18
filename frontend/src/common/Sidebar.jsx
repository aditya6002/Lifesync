import { BookOpen, CalendarCheck, FileText, House, ListChecks, Wallet, UserRound } from "lucide-react";
import { useState } from "react";

const ITEMS = [
  { id: "home", label: "Home", Icon: House },
  { id: "calendar", label: "Calendar", Icon: CalendarCheck },
  { id: "journal", label: "Journal", Icon: BookOpen },
  { id: "expenses", label: "Expenses", Icon: Wallet },
  { id: "tasks", label: "Tasks", Icon: ListChecks },
  { id: "notes", label: "Notes", Icon: FileText },
  { id: "profile", label: "Profile", Icon: UserRound },
];

const Sidebar = () => {
  const [active, setActive] = useState("home");

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map(({ id, label, Icon }, index) => (
        <div className="contents" key={id}>
          <button
            type="button"
            aria-label={label}
            aria-current={active === id ? "page" : undefined}
            title={label}
            onClick={() => setActive(id)}
            className={`nav-item ${active === id ? "active" : ""}`}
          >
            <Icon size={23} strokeWidth={1.8} />
          </button>
          {index < ITEMS.length - 1 && <span className="nav-divider" aria-hidden="true" />}
        </div>
      ))}
    </nav>
  );
};

export default Sidebar;

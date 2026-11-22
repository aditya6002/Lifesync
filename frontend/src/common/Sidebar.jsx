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
  { id: "home", label: "Home", Icon: House, path: "/" },
  { id: "calendar", label: "Calendar", Icon: CalendarCheck, path: "/calendar" },
  { id: "journal", label: "Journal", Icon: BookOpen, path: "/journal" },
  { id: "expenses", label: "Expenses", Icon: Wallet, path: "/expenses" },
  { id: "tasks", label: "Tasks", Icon: ListChecks, path: "/tasks" },
  { id: "notes", label: "Notes", Icon: FileText, path: "/notes" },
  { id: "profile", label: "Profile", Icon: UserRound, path: "/profile" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map(({ id, label, Icon, path }, index) => {
        let isActive = false;
        if (id === "home") {
          isActive = pathname === "/";
        } else if (id === "calendar") {
          isActive = pathname === "/calendar";
        } else if (id === "expenses") {
          isActive = pathname.startsWith("/expenses");
        } else if (id === "journal") {
          isActive = pathname.startsWith("/journal");
        } else if (id === "tasks") {
          isActive = pathname.startsWith("/tasks");
        } else if (id === "notes") {
          isActive = pathname.startsWith("/notes");
        } else if (id === "profile") {
          isActive = pathname.startsWith("/profile");
        } else {
          isActive = false;
        }

        return (
          <div className="contents" key={id}>
            <button
              type="button"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              title={label}
              onClick={() => navigate(path)}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={21} strokeWidth={1.8} className="nav-icon" />
            </button>
            {index < ITEMS.length - 1 && (
              <span className="nav-divider" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Sidebar;

import {
  Home,
  CalendarCheckIcon,
  StickyNote,
  UserCircleIcon,
  BookMinusIcon,
  Wallet,
  LucideListTodo,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isActive, setIsActive] = useState("home");

  function changePage(page) {
    setIsActive(page);
  }

  const activeClass = "bg-[#d9d9d9] text-black rounded-full";
  const styles =
    "w-16 h-10 font-extrabold cursor-pointer  flex justify-center items-center active:scale-95";

  return (
    <div className="w-[96%] flex bg-white rounded-4xl h-14 justify-between items-center px-32 fixed bottom-4 ml-[2%] border-black border">
      <div
        onClick={() => changePage("home")}
        className={`${styles} ${isActive === "home" && activeClass}`}
      >
        <Home />
      </div>
      <div
        onClick={() => changePage("calendar")}
        className={`${styles} ${isActive === "calendar" && activeClass}`}
      >
        <CalendarCheckIcon />
      </div>
      <div
        onClick={() => changePage("journal")}
        className={`${styles} ${isActive === "journal" && activeClass}`}
      >
        <BookMinusIcon />
      </div>
      <div
        onClick={() => changePage("expenses")}
        className={`${styles} ${isActive === "expenses" && activeClass}`}
      >
        <Wallet />
      </div>

      <div
        onClick={() => changePage("tasks")}
        className={`${styles} ${isActive === "tasks" && activeClass}`}
      >
        <LucideListTodo />
      </div>

      <div
        onClick={() => changePage("note")}
        className={`${styles} ${isActive === "note" && activeClass}`}
      >
        <StickyNote />
      </div>
      <div
        onClick={() => changePage("profile")}
        className={`${styles} ${isActive === "profile" && activeClass}`}
      >
        <UserCircleIcon />
      </div>
    </div>
  );
};

export default Sidebar;

import { Activity, Search, UserRound } from "lucide-react";

const Nav = () => (
  <header className="topbar">
    <div className="brand logo" aria-label="LifeSync home">
      <Activity className="brand-mark" strokeWidth={1.8} />
      <span>LifeSync</span>
    </div>
    <div className="topbar-actions">
      <label className="search-box" htmlFor="lifesync-search">
        <Search size={21} />
        <input id="lifesync-search" type="search" placeholder="Search..." aria-label="Search LifeSync" />
      </label>
      <button className="avatar" type="button" aria-label="Profile">
        <UserRound size={21} />
      </button>
    </div>
  </header>
);

export default Nav;

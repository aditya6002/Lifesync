import { SearchIcon, UserCircleIcon } from "lucide-react";

const Nav = () => {
  return (
    <div className="flex bg-white rounded-4xl  h-17 justify-between items-center px-8 fixed w-[96%] ml-[2%] top-6">
      <div className="text-3xl text-black font-medium select-none">
        <span className="mr-0.5 font-semibold">L</span>
        <span className="text-sm mr-0.5">IFE</span>
        <span className="font-semibold">S</span>
        <span className="text-sm">YNC</span>
      </div>

      <div className="w-1/3 flex justify-between">
        <div className="h-10 bg-[#ececec] w-full rounded-4xl flex justify-between items-center overflow-hidden gap-2">
          {" "}
          {/* 10/12 */}
          <label htmlFor="search">
            <SearchIcon className="ml-3 cursor-pointer text-black font-semibold" />
          </label>
          <input
            type="text"
            className="flex-1 h-full rounded-4xl px-4 outline-0 border-none pl-0 text-[#020202]"
            id="search"
            placeholder="Search..."
          />
        </div>
        {/* <div className="w-10 h-10 rounded-full bg-[#e3e3e3] flex justify-center items-center p-0.5 cursor-pointer">
          <UserCircleIcon />
        </div> */}
      </div>
    </div>
  );
};

export default Nav;

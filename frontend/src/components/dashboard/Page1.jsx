
import RightSidePage from "./RightSidePage";
import LeftSidePage from "./LeftSidePage";

const Page1 = () => {
  return (
    <div className="h-screen w-full bg-[#ececec] px-12 pt-26 py-20">
      <div className="w-full h-full bg-pink-300 flex justify-around items-center">
        <LeftSidePage />
        <RightSidePage />
      </div>
    </div>
  );
};

export default Page1;

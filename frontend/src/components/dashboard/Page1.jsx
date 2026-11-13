import RightSidePage from "./RightSidePage1";
import LeftSidePage from "./LeftSidePage1";

const Page1 = () => {
  return (
    <div className="h-screen w-full bg-[#ececec] px-12 pt-26 py-20">
      <div className="w-full h-full flex justify-around items-center">
        <LeftSidePage />
        <RightSidePage />
      </div>
    </div>
  );
};

export default Page1;

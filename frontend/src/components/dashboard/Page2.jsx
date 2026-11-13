import LeftSidePage2 from "./LeftSidePage2";
import RightSidePage2 from "./RightSidePage2";

const Page2 = () => {
  return (
    <div className="h-screen w-full bg-[#ececec] px-12 pt-12 pb-6">
      <div className="w-full h-full flex justify-around items-center">
        <LeftSidePage2 />
        <RightSidePage2 />
      </div>
    </div>
  );
};

export default Page2;

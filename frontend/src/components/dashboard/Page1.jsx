import RightSidePage from "./RightSidePage1";
import LeftSidePage from "./LeftSidePage1";

const Page1 = () => (
  <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" aria-label="LifeSync overview">
    <div className="lg:col-span-6">
      <LeftSidePage />
    </div>
    <div className="lg:col-span-6">
      <RightSidePage />
    </div>
  </main>
);

export default Page1;

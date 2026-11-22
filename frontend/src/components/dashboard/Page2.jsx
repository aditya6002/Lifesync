import LeftSidePage2 from "./LeftSidePage2";
import RightSidePage2 from "./RightSidePage2";

const Page2 = () => (
  <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" aria-label="LifeSync productivity">
    <div className="lg:col-span-7">
      <LeftSidePage2 />
    </div>
    <div className="lg:col-span-5">
      <RightSidePage2 />
    </div>
  </section>
);

export default Page2;

import RightSidePage from "./RightSidePage1";
import LeftSidePage from "./LeftSidePage1";

const Page1 = () => (
  <main className="dashboard-page" aria-label="LifeSync overview">
    <LeftSidePage />
    <RightSidePage />
  </main>
);

export default Page1;

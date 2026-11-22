import Page1 from "../components/dashboard/Page1";
import Page2 from "../components/dashboard/Page2";

const DashboardPage = () => (
  <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-8">
    <Page1 />
    <Page2 />
  </div>
);

export default DashboardPage;

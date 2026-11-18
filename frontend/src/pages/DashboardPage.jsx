import Page1 from "../components/dashboard/Page1";
import Page2 from "../components/dashboard/Page2";

const DashboardPage = () => (
  <div className="dashboard-content">
    <Page1 />
    <div style={{ height: 34 }} aria-hidden="true" />
    <Page2 />
  </div>
);

export default DashboardPage;

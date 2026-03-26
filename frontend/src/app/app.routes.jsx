import { createBrowserRouter } from "react-router";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPages";
import Protected from "../features/auth/components/Protected";
import AppLayout from "../shared/components/layout/AppLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ExpensesPage from "../features/expenses/pages/ExpensesPage";
import JournalPage from "../features/journal/pages/JournalPage";
import NotesPage from "../features/notes/pages/NotesPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import AIAssistantPage from "../features/ai/pages/AIAssistantPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SubscriptionPage from "../features/subscription/pages/SubscriptionPage";
import ActivityPage from "../features/activity/pages/ActivityPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },

  {
    path: "/expenses",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <ExpensesPage /> }],
  },

  {
    path: "/journal",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <JournalPage /> }],
  },

  {
    path: "/notes",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <NotesPage /> }],
  },

  {
    path: "/tasks",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <TasksPage /> }],
  },

  {
    path: "/ai",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <AIAssistantPage /> }],
  },

  {
    path: "/profile",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <ProfilePage /> }],
  },

  {
    path: "/subscription",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <SubscriptionPage /> }],
  },

  {
    path: "activity",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <ActivityPage /> }],
  },

  {
    path: "*",
    element: (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        Route Not found
      </h1>
    ),
  },
]);

// src/app/app.providers.jsx
import { BrowserRouter } from "react-router-dom";
import { LoaderProvider } from "../shared/components/ui/GlobalLoader";
// import { AuthProvider } from "../features/auth/auth.context";
import { SubscriptionProvider } from "../features/subscription/subscription.context";
import { ActivityProvider } from "../features/activity/activity.context";
import { ExpensesProvider } from "../features/expenses/expenses.context";
import { JournalProvider } from "../features/journal/journal.context";
import { NotesProvider } from "../features/notes/notes.context";
import { TasksProvider } from "../features/tasks/tasks.context";

export default function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <LoaderProvider>
        {/* <AuthProvider> */}
        <SubscriptionProvider>
          <ActivityProvider>
            <ExpensesProvider>
              <JournalProvider>
                <NotesProvider>
                  <TasksProvider>{children}</TasksProvider>
                </NotesProvider>
              </JournalProvider>
            </ExpensesProvider>
          </ActivityProvider>
        </SubscriptionProvider>
        {/* </AuthProvider> */}
      </LoaderProvider>
    </BrowserRouter>
  );
}

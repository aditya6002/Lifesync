import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import {
  LoaderProvider,
  PageSkeleton,
} from "../shared/components/ui/GlobalLoader.tsx";
import { AuthProvider } from "../features/auth/auth.context";
import { ActivityProvider } from "../features/activity/activity.context";
import { ExpensesProvider } from "../features/expenses/expenses.context";
import { JournalProvider } from "../features/journal/journal.context";
import { NotesProvider } from "../features/notes/notes.context";
import { TasksProvider } from "../features/tasks/tasks.context";

function AppContent({ children }: { children: ReactNode }) {
  const loading = false;
  if (loading) {
    return <PageSkeleton />;
  }

  return <>{children}</>;
}

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <AuthProvider>
          <ActivityProvider>
            <ExpensesProvider>
              <JournalProvider>
                <NotesProvider>
                  <TasksProvider>
                    <AppContent>{children}</AppContent>
                  </TasksProvider>
                </NotesProvider>
              </JournalProvider>
            </ExpensesProvider>
          </ActivityProvider>
        </AuthProvider>
      </LoaderProvider>
    </BrowserRouter>
  );
}

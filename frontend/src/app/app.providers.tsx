// src/app/app.providers.tsx
import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "../features/auth/auth.context";
import { ActivityProvider } from "../features/activity/activity.context";
import { ExpensesProvider } from "../features/expenses/expenses.context";
import { JournalProvider } from "../features/journal/journal.context";
import { NotesProvider } from "../features/notes/notes.context";
import { TasksProvider } from "../features/tasks/tasks.context";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActivityProvider>
          <ExpensesProvider>
            <JournalProvider>
              <NotesProvider>
                <TasksProvider>
                  {children}
                </TasksProvider>
              </NotesProvider>
            </JournalProvider>
          </ExpensesProvider>
        </ActivityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

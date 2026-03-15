// src/shared/types/index.ts

// ── User ──────────────────────────────────────────────────
export interface User {
  id:        string;
  name:      string;
  email:     string;
  phone?:    string;
  bio?:      string;
  college?:  string;
  year?:     string;
  location?: string;
  goal?:     string;
  createdAt: string;
  achievements: string[];
}

// ── Auth ──────────────────────────────────────────────────
export interface LoginPayload  { email: string; password: string }
export interface SignupPayload { name: string; email: string; password: string }
export interface AuthResponse  { user: User; message?: string , accessToken?: string }
export interface getUserResponse { user: object; message?: string }

// ── Expense ───────────────────────────────────────────────
export type ExpenseCategory =
  | "Food" | "Travel" | "Study" | "Health"
  | "Entertainment" | "Shopping" | "Income" | "Other";

export interface Expense {
  id:        string;
  name:      string;
  cat:       ExpenseCategory;
  amount:    number;
  date:      string;
  note?:     string;
  icon?:     string;
  userId:    string;
  createdAt: string;
}
export type ExpenseFormData = Omit<Expense, "id" | "userId" | "createdAt" | "icon">;

// ── Journal ───────────────────────────────────────────────
export type MoodLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface JournalEntry {
  id:        string;
  title?:    string;
  content:   string;
  mood:      MoodLevel;
  date:      string;
  userId:    string;
  createdAt: string;
}
export type JournalFormData = Omit<JournalEntry, "id" | "userId" | "createdAt">;

// ── Notes ─────────────────────────────────────────────────
export type NoteTag = "Study" | "Personal" | "Reading" | "Career" | "Ideas" | "Health";

export interface Note {
  id:        string;
  title:     string;
  content:   string;
  tag:       NoteTag;
  color:     string;
  userId:    string;
  updatedAt: string;
  createdAt: string;
}
export type NoteFormData = Omit<Note, "id" | "userId" | "updatedAt" | "createdAt">;

// ── Tasks ─────────────────────────────────────────────────
export type Priority  = "high" | "medium" | "low";
export type TaskGroup = "today" | "tomorrow" | "upcoming";

export interface Task {
  id:        string;
  title:     string;
  priority:  Priority;
  due:       string;
  group:     TaskGroup;
  note?:     string;
  done:      boolean;
  userId:    string;
  createdAt: string;
}
export type TaskFormData = Omit<Task, "id" | "userId" | "createdAt">;

// ── Activity ──────────────────────────────────────────────
export type ActivityModule = "expenses" | "journal" | "notes" | "tasks" | "ai";
export type ActivityAction = "created" | "updated" | "deleted" | "completed" | "viewed";

export interface ActivityLog {
  id:          string;
  userId:      string;
  module:      ActivityModule;
  action:      ActivityAction;
  entityId?:   string;
  entityName?: string;
  meta?:       Record<string, unknown>;
  date:        string;
  createdAt:   string;
}

export interface HeatmapCell {
  date:    string;
  count:   number;
  level:   0 | 1 | 2 | 3 | 4;
  label:   string;
  modules: ActivityModule[];
}

export interface DailyScore {
  date:         string;
  score:        number;
  breakdown: {
    tasks:    { score: number; weight: string };
    journal:  { score: number; weight: string };
    expenses: { score: number; weight: string };
    notes:    { score: number; weight: string };
  };
  totalActions: number;
}

export interface ApiResponse<T> {
  success:  boolean;
  data:     T;
  message?: string;
}

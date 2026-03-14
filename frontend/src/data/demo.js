// src/data/demo.js  ── all static demo data used across the app

export const DEMO_USER = {
  name: "Arjun Sharma",
  email: "arjun@lumina.app",
};

export const DEMO_EXPENSES = [
  {
    id: 1,
    name: "Zomato Order",
    cat: "Food",
    amount: -340,
    date: "2026-03-11",
    note: "Late night dinner",
    icon: "🍜",
  },
  {
    id: 2,
    name: "Metro Card Recharge",
    cat: "Travel",
    amount: -200,
    date: "2026-03-11",
    note: "Monthly pass",
    icon: "🚇",
  },
  {
    id: 3,
    name: "Pocket Money",
    cat: "Income",
    amount: 3000,
    date: "2026-03-10",
    note: "From dad",
    icon: "💰",
  },
  {
    id: 4,
    name: "Notion Pro",
    cat: "Study",
    amount: -299,
    date: "2026-03-09",
    note: "Annual subscription",
    icon: "📚",
  },
  {
    id: 5,
    name: "Gym Membership",
    cat: "Health",
    amount: -800,
    date: "2026-03-08",
    note: "Monthly fee",
    icon: "🏋️",
  },
  {
    id: 6,
    name: "Movie Ticket",
    cat: "Entertainment",
    amount: -280,
    date: "2026-03-07",
    note: "With friends",
    icon: "🎬",
  },
];

export const DEMO_NOTES = [
  {
    id: 1,
    tag: "Study",
    color: "#7C3AED",
    updated: "2h ago",
    title: "Data Structures Notes",
    content:
      "Binary trees:\n- Each node has at most 2 children\n- AVL trees maintain balance factor ∈ {-1,0,1}\n\nRotations:\n1. LL → Right rotation\n2. RR → Left rotation\n\nHeap Sort: build max-heap O(n), extract n times O(n log n)",
  },
  {
    id: 2,
    tag: "Personal",
    color: "#3b82f6",
    updated: "Yesterday",
    title: "Project Ideas 2025",
    content:
      "1. AI journal app with mood analysis\n2. Expense tracker with ML predictions\n3. Collaborative whiteboard tool\n4. Habit tracker with streaks\n5. Voice-to-text notes with tagging",
  },
  {
    id: 3,
    tag: "Reading",
    color: "#f59e0b",
    updated: "Mar 9",
    title: "Atomic Habits — Summary",
    content:
      "1% Rule: Tiny improvements compound. 1% better daily = 37× better in a year.\n\nHabit Loop: Cue → Craving → Response → Reward\n\nHabit Stacking: After [CURRENT], I will [NEW]\n\nEnvironment Design: Make good habits obvious.",
  },
  {
    id: 4,
    tag: "Career",
    color: "#22c55e",
    updated: "Mar 8",
    title: "Interview Prep Checklist",
    content:
      "System Design:\n☐ Load balancing\n☐ Database sharding\n☐ CAP theorem\n\nDSA:\n☐ Arrays & strings\n☐ Trees & graphs\n☐ DP patterns\n☐ Sliding window",
  },
];

export const DEMO_TASKS = [
  {
    id: 1,
    title: "Submit DSA assignment",
    priority: "high",
    due: "2026-03-11",
    done: false,
    group: "today",
    note: "Chapter 5 problems",
  },
  {
    id: 2,
    title: "Read DBMS Chapter 7",
    priority: "medium",
    due: "2026-03-11",
    done: true,
    group: "today",
    note: "",
  },
  {
    id: 3,
    title: "Push project to GitHub",
    priority: "high",
    due: "2026-03-12",
    done: false,
    group: "tomorrow",
    note: "Include README",
  },
  {
    id: 4,
    title: "Call parents",
    priority: "low",
    due: "2026-03-12",
    done: false,
    group: "tomorrow",
    note: "",
  },
  {
    id: 5,
    title: "Mock interview prep",
    priority: "high",
    due: "2026-03-15",
    done: false,
    group: "upcoming",
    note: "Focus on system design",
  },
  {
    id: 6,
    title: "Pay hostel fees",
    priority: "medium",
    due: "2026-03-16",
    done: false,
    group: "upcoming",
    note: "₹4500 due",
  },
];

export const DEMO_JOURNAL = [
  {
    id: 1,
    date: "2026-03-11",
    mood: 4,
    title: "Productive Wednesday",
    content:
      "Had a really productive day today. Finished two assignments and finally understood AVL trees. Went for a 30-min walk in the evening. Feeling optimistic about the upcoming exam.",
  },
  {
    id: 2,
    date: "2026-03-10",
    mood: 2,
    title: "Distracted day",
    content:
      "Couldn't focus much. Scrolled social media for 3 hours straight. Need to fix my sleep schedule. Will try sleeping by 11 PM tonight.",
  },
  {
    id: 3,
    date: "2026-03-09",
    mood: 3,
    title: "Steady progress",
    content:
      "Good gym session today. Started reading Atomic Habits again from Chapter 3. Had a decent study session in the evening.",
  },
  {
    id: 4,
    date: "2026-03-08",
    mood: 1,
    title: "Rough Sunday",
    content:
      "Failed the weekly quiz. Score was 4/10. Feeling low but trying to stay motivated. Going to make a proper study plan this week.",
  },
];

export const DEMO_CHAT_HISTORY = [
  { id: 1, title: "Expense analysis March", time: "Today" },
  { id: 2, title: "Study plan for exams", time: "Yesterday" },
  { id: 3, title: "Mood pattern insights", time: "Mar 9" },
  { id: 4, title: "Task prioritization", time: "Mar 8" },
];

export const AI_REPLIES = [
  "Based on your March expenses, you've spent ₹2,839 total — food is 40% of that. I'd suggest setting a ₹1,500/month food budget.",
  "Your journal shows a positive mood trend this week! 😄 You're most productive on days after gym sessions — worth noting!",
  "You have 4 pending tasks. I recommend tackling 'Submit DSA assignment' first — it's high priority and due today.",
  "Here's a study plan: 2 hrs DSA → 1 hr DBMS → 30 min review. Repeat for 5 days before your exam.",
  "Your mood pattern shows Sundays are your toughest days. Try planning a small reward to improve consistency.",
  "Looking at your notes, you have 4 study-related items. Want me to create a revision schedule based on deadlines?",
];

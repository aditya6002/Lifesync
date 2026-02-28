import { useEffect, useState } from "react";
import HomeUpper from "../components/Home/HomeUpper";
import HomeMiddle from "../components/Home/HomeMiddle";
import HomeBottom from "../components/Home/HomeBottom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { createNote } from "../api/Auth.js";
import axios from "axios";

const Home = () => {
  const tl = gsap.timeline();
  createNote({ title: "Sample Note", content: "This is a sample note." });

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/home", {
          withCredentials: true,
        });
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    getData();
  }, []);

  const diary = useSelector((state) => state.diary.entry);
  const notes = useSelector((state) => state.notes.notes);
  const allExpenses = useSelector((state) => state.expenses.expenses);
  let tasks = useSelector((state) => state.todo.todo);
  tasks = tasks.filter((task) => task.isDone != true);

  function onChangeTab(route) {
    window.location.href = route;
  }

  let [stats, _] = useState({
    recentExpenses: [],
    pendingHabits: [],
    latestDiary: [
      {
        title: "Morning Reflections",
        date: "12/12/2025",
        content:
          "Woke up super fresh today. Trying to keep this momentum going!",
      },
    ],
  });

  const today = new Date();
  const expenses = allExpenses.filter(
    (item) =>
      item.createdAt.month === today.getMonth() &&
      item.createdAt.year === today.getFullYear(),
  );
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const todo = tasks.filter(
    (t) =>
      t.createdAt.date === today.getDate() &&
      t.createdAt.month === today.getMonth() &&
      t.createdAt.year === today.getFullYear(),
  );
  const progress = todo.filter((t) => t.isDone != true);
  const done = todo.filter((t) => t.isDone == true);

  const totalTasks = todo.length + progress.length + done.length;
  const completedTasks = done.length;

  const progressPercent =
    totalTasks === 0 ? 100 : Math.round((completedTasks / totalTasks) * 100);
  return (
    <div className="flex flex-col overflow-hidden space-y-6 px-8 pt-4">
      <HomeUpper />

      <HomeMiddle
        onChangeTab={onChangeTab}
        total={total}
        progressPercent={progressPercent}
        notes={notes}
        diaries={diary}
      />
      <HomeBottom
        tl={tl}
        onChangeTab={onChangeTab}
        data={stats}
        expenses={expenses}
        tasks={tasks}
        diaries={diary}
        notes={notes}
      />
    </div>
  );
};

export default Home;

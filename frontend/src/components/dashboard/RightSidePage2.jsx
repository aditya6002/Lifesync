import QuickNotes from "./QuickNotes";
import LastJournalCard from "./LastJournalCard";

const RightSidePage2 = () => {
  return (
    <aside className="flex flex-col gap-6" aria-label="Notes and journal">
      <QuickNotes />
      <LastJournalCard />
    </aside>
  );
};

export default RightSidePage2;
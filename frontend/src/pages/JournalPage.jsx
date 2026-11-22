import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import journalApi from "../api/journal.api";
import {
  setJournals,
  appendJournals,
  addJournal,
  updateJournal,
  removeJournal,
} from "../store/features/journalSlice";
import JournalSidebar from "../components/journal/JournalSidebar";
import JournalTimeline from "../components/journal/JournalTimeline";
import JournalEditor from "../components/journal/JournalEditor";
import JournalReader from "../components/journal/JournalReader";
import ConfirmDeleteModal from "../components/journal/ConfirmDeleteModal";
import { Check, AlertCircle } from "lucide-react";

const PAGE_LIMIT = 15;

const JournalPage = () => {
  const dispatch = useDispatch();
  const { journals = [] } = useSelector((state) => state.journal || {});

  const [view, setView] = useState("timeline"); // "timeline" | "editor" | "reader"
  const [editorTarget, setEditorTarget] = useState(null);
  const [readerEntry, setReaderEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch initial journals
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const res = await journalApi.getAllJournals(0, PAGE_LIMIT);
        if (res?.journals) {
          dispatch(setJournals(res.journals));
          setSkip(res.journals.length);
          setHasMore(res.journals.length >= PAGE_LIMIT);
        }
      } catch (err) {
        console.warn("Could not load journals from server:", err?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [dispatch]);

  // Load more journals
  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const res = await journalApi.getAllJournals(skip, PAGE_LIMIT);
      if (res?.journals) {
        dispatch(appendJournals(res.journals));
        setSkip((prev) => prev + res.journals.length);
        setHasMore(res.journals.length >= PAGE_LIMIT);
      }
    } catch {
      showToast("Could not load more entries", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtered journals
  const filteredJournals = useMemo(() => {
    return journals.filter((j) => {
      if (moodFilter && j.mood !== moodFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = j.title?.toLowerCase().includes(q);
        const matchContent = j.content?.toLowerCase().includes(q);
        if (!matchTitle && !matchContent) return false;
      }
      return true;
    });
  }, [journals, moodFilter, search]);

  // Navigation handlers
  const openNew = () => {
    setEditorTarget(null);
    setView("editor");
  };

  const openEdit = (journal) => {
    setEditorTarget(journal);
    setView("editor");
  };

  const openRead = (journal) => {
    setReaderEntry(journal);
    setView("reader");
  };

  const backToTimeline = () => {
    setView("timeline");
    setEditorTarget(null);
    setReaderEntry(null);
  };

  // Save handler (create or update)
  const handleSave = async ({ title, content, mood }) => {
    setSaving(true);
    try {
      if (editorTarget) {
        const targetId = editorTarget._id || editorTarget.id;
        const res = await journalApi.editJournal(targetId, { title, content, mood });
        dispatch(updateJournal(res?.journal || { ...editorTarget, title, content, mood }));
        showToast("Reflection updated ✏️");
      } else {
        const res = await journalApi.addJournal({ title, content, mood });
        const created = res?.journal || { _id: `local-${Date.now()}`, title, content, mood, createdAt: new Date() };
        dispatch(addJournal(created));
        showToast("Story recorded ✨");
      }
      backToTimeline();
    } catch {
      showToast("Failed to save reflection", "error");
    } finally {
      setSaving(false);
    }
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const targetId = deleteTarget._id || deleteTarget.id;
    try {
      await journalApi.deleteJournal(targetId);
      dispatch(removeJournal(targetId));
      showToast("Reflection deleted 🗑️");
      setDeleteTarget(null);
      if (view === "reader") backToTimeline();
    } catch {
      showToast("Could not delete reflection", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" aria-label="LifeSync Journal">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-sm shadow-xl animate-in slide-in-from-right-4 duration-200 ${
            toast.type === "success" ? "bg-emerald-600 shadow-emerald-600/30" : "bg-rose-600 shadow-rose-600/30"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Editor View */}
      {view === "editor" && (
        <JournalEditor
          initialJournal={editorTarget}
          onSave={handleSave}
          onCancel={backToTimeline}
          saving={saving}
        />
      )}

      {/* Reader View */}
      {view === "reader" && (
        <JournalReader
          journal={readerEntry}
          onBack={backToTimeline}
          onEdit={openEdit}
          onDelete={(j) => setDeleteTarget(j)}
        />
      )}

      {/* Timeline View with Sidebar */}
      {view === "timeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <JournalSidebar
              journals={journals}
              onNew={openNew}
              moodFilter={moodFilter}
              onMoodFilter={setMoodFilter}
              search={search}
              onSearch={setSearch}
            />
          </div>

          <main className="lg:col-span-8">
            <JournalTimeline
              journals={filteredJournals}
              hasMore={hasMore}
              loading={loading}
              onLoadMore={handleLoadMore}
              onRead={openRead}
              onEdit={openEdit}
              onDelete={(j) => setDeleteTarget(j)}
              onNew={openNew}
            />
          </main>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        entry={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default JournalPage;

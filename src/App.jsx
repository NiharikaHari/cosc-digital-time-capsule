import { useEffect, useMemo, useState } from "react";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import CapsuleForm from "./components/CapsuleForm";
import CapsuleGrid from "./components/CapsuleGrid";
import CapsuleDetail from "./components/CapsuleDetail";
import SharedCapsuleView from "./components/SharedCapsuleView";
import useNow from "./hooks/useNow";
import { fetchCapsules, createCapsule, deleteCapsule } from "./api";
import { isUnlocked } from "./utils/dateUtils";
import { getSharedCapsuleFromLocation } from "./utils/shareUtils";
import "./App.css";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "locked", label: "Locked" },
  { id: "unlocked", label: "Unlocked" },
];

export default function App() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [viewingCapsule, setViewingCapsule] = useState(null);
  const [deletingCapsule, setDeletingCapsule] = useState(null);
  const [sharedCapsule, setSharedCapsule] = useState(getSharedCapsuleFromLocation);
  const now = useNow();

  useEffect(() => {
    let cancelled = false;
    fetchCapsules()
      .then((data) => {
        if (cancelled) return;
        setCapsules(data);
        setError("");
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleHashChange() {
      setSharedCapsule(getSharedCapsuleFromLocation());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredCapsules = useMemo(() => {
    const sorted = [...capsules].sort(
      (a, b) => new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime()
    );
    if (filter === "locked") return sorted.filter((c) => !isUnlocked(c.unlockAt, now));
    if (filter === "unlocked") return sorted.filter((c) => isUnlocked(c.unlockAt, now));
    return sorted;
  }, [capsules, filter, now]);

  async function handleCreate(data) {
    try {
      const created = await createCapsule(data);
      setCapsules((prev) => [...prev, created]);
      setError("");
      setIsCreating(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleConfirmDelete() {
    const capsuleId = deletingCapsule.id;
    try {
      await deleteCapsule(capsuleId);
      setCapsules((prev) => prev.filter((c) => c.id !== capsuleId));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingCapsule(null);
    }
  }

  function handleDismissShared() {
    history.replaceState(null, "", location.pathname + location.search);
    setSharedCapsule(null);
  }

  if (sharedCapsule) {
    return <SharedCapsuleView capsule={sharedCapsule} onDismiss={handleDismissShared} />;
  }

  const lockedCount = capsules.filter((c) => !isUnlocked(c.unlockAt, now)).length;

  return (
    <div className="app-page">
      <header className="topbar">
        <span className="app-icon" aria-hidden="true">⏳</span>
        <h1 className="app-title">Digital Time Capsule</h1>
        <div className="topbar-actions">
          <button className="primary" onClick={() => setIsCreating(true)}>
            + New Capsule
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && <p className="form-error save-error">{error}</p>}

        <div className="filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={filter === f.id ? "filter-active" : ""}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id === "locked" && lockedCount > 0 ? ` (${lockedCount})` : ""}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="loading-message">Loading capsules…</p>
        ) : (
          <CapsuleGrid
            capsules={filteredCapsules}
            now={now}
            onView={setViewingCapsule}
            onDelete={setDeletingCapsule}
            emptyMessage={
              capsules.length === 0
                ? "No capsules yet. Seal a memory for your future self."
                : "No capsules in this filter."
            }
          />
        )}
      </main>

      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <CapsuleForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </Modal>
      )}

      {viewingCapsule && (
        <Modal onClose={() => setViewingCapsule(null)}>
          <CapsuleDetail capsule={viewingCapsule} now={now} onClose={() => setViewingCapsule(null)} />
        </Modal>
      )}

      {deletingCapsule && (
        <Modal onClose={() => setDeletingCapsule(null)}>
          <ConfirmDialog
            title="Delete capsule?"
            message={`Delete "${deletingCapsule.title}"? This can't be undone.`}
            confirmLabel="Delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeletingCapsule(null)}
          />
        </Modal>
      )}
    </div>
  );
}

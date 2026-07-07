import { useEffect, useMemo, useState } from "react";
import Modal from "./components/Modal";
import ConfirmDialog from "./components/ConfirmDialog";
import CapsuleForm from "./components/CapsuleForm";
import CapsuleGrid from "./components/CapsuleGrid";
import CapsuleDetail from "./components/CapsuleDetail";
import SharedCapsuleView from "./components/SharedCapsuleView";
import useNow from "./hooks/useNow";
import { loadState, saveState } from "./storage";
import { isUnlocked } from "./utils/dateUtils";
import { getSharedCapsuleFromLocation } from "./utils/shareUtils";
import "./App.css";

let idCounter = Date.now();
function nextId() {
  idCounter += 1;
  return `capsule-${idCounter}`;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "locked", label: "Locked" },
  { id: "unlocked", label: "Unlocked" },
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [saveError, setSaveError] = useState("");
  const [filter, setFilter] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState(null);
  const [viewingCapsule, setViewingCapsule] = useState(null);
  const [deletingCapsule, setDeletingCapsule] = useState(null);
  const [sharedCapsule, setSharedCapsule] = useState(getSharedCapsuleFromLocation);
  const now = useNow();

  useEffect(() => {
    setSaveError(saveState(state) ?? "");
  }, [state]);

  useEffect(() => {
    function handleHashChange() {
      setSharedCapsule(getSharedCapsuleFromLocation());
    }
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredCapsules = useMemo(() => {
    const sorted = [...state.capsules].sort(
      (a, b) => new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime()
    );
    if (filter === "locked") return sorted.filter((c) => !isUnlocked(c.unlockAt, now));
    if (filter === "unlocked") return sorted.filter((c) => isUnlocked(c.unlockAt, now));
    return sorted;
  }, [state.capsules, filter, now]);

  function handleCreate(data) {
    setState((prev) => ({ ...prev, capsules: [...prev.capsules, { id: nextId(), createdAt: new Date().toISOString(), ...data }] }));
    setIsCreating(false);
  }

  function handleUpdate(data) {
    const capsuleId = editingCapsule.id;
    setState((prev) => ({
      ...prev,
      capsules: prev.capsules.map((capsule) =>
        capsule.id === capsuleId ? { ...capsule, ...data } : capsule
      ),
    }));
    setEditingCapsule(null);
  }

  function handleConfirmDelete() {
    const capsuleId = deletingCapsule.id;
    setState((prev) => ({ ...prev, capsules: prev.capsules.filter((c) => c.id !== capsuleId) }));
    setDeletingCapsule(null);
  }

  function handleDismissShared() {
    history.replaceState(null, "", location.pathname + location.search);
    setSharedCapsule(null);
  }

  if (sharedCapsule) {
    return <SharedCapsuleView capsule={sharedCapsule} onDismiss={handleDismissShared} />;
  }

  const lockedCount = state.capsules.filter((c) => !isUnlocked(c.unlockAt, now)).length;

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
        {saveError && <p className="form-error save-error">{saveError}</p>}

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

        <CapsuleGrid
          capsules={filteredCapsules}
          now={now}
          onView={setViewingCapsule}
          onEdit={setEditingCapsule}
          onDelete={setDeletingCapsule}
          emptyMessage={
            state.capsules.length === 0
              ? "No capsules yet. Seal a memory for your future self."
              : "No capsules in this filter."
          }
        />
      </main>

      {isCreating && (
        <Modal onClose={() => setIsCreating(false)}>
          <CapsuleForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />
        </Modal>
      )}

      {editingCapsule && (
        <Modal onClose={() => setEditingCapsule(null)}>
          <CapsuleForm
            initialValues={editingCapsule}
            heading="Edit capsule"
            submitLabel="Save"
            onSubmit={handleUpdate}
            onCancel={() => setEditingCapsule(null)}
          />
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

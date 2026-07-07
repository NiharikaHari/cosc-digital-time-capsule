import useNow from "../hooks/useNow";
import CapsuleDetail from "./CapsuleDetail";

export default function SharedCapsuleView({ capsule, onDismiss }) {
  const now = useNow();

  return (
    <div className="app-page">
      <header className="topbar">
        <span className="app-icon" aria-hidden="true">
          ⏳
        </span>
        <h1 className="app-title">Digital Time Capsule</h1>
      </header>

      <main className="app-main shared-capsule-main">
        <p className="shared-capsule-banner">You're viewing a capsule someone shared with you.</p>
        <div className="capsule-detail-card">
          <CapsuleDetail capsule={capsule} now={now} readOnly showClose={false} />
        </div>
        <button type="button" className="shared-capsule-exit" onClick={onDismiss}>
          Go to my capsules
        </button>
      </main>
    </div>
  );
}

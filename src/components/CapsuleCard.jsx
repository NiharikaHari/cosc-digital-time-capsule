import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { formatDateTime, isUnlocked } from "../utils/dateUtils";
import { buildShareUrl } from "../utils/shareUtils";

export default function CapsuleCard({ capsule, now, onView, onDelete }) {
  const [copied, setCopied] = useState(false);
  const unlocked = isUnlocked(capsule.unlockAt, now);

  async function handleShare() {
    const url = buildShareUrl(capsule);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className={`capsule-card ${unlocked ? "capsule-card-unlocked" : "capsule-card-locked"}`}>
      <div className="capsule-card-header">
        <span className="capsule-card-icon" aria-hidden="true">
          {unlocked ? "📬" : "⏳"}
        </span>
        <span className="visibility-badge">{capsule.visibility === "public" ? "🌐 Public" : "🔐 Private"}</span>
      </div>

      <h2 className="capsule-card-title">{capsule.title}</h2>

      {unlocked ? (
        <p className="capsule-card-preview">{capsule.message}</p>
      ) : (
        <div className="capsule-card-locked-body">
          <p className="capsule-card-locked-label">Unlocks in</p>
          <CountdownTimer unlockAt={capsule.unlockAt} now={now} size="sm" />
        </div>
      )}

      <p className="capsule-card-date">
        {unlocked ? "Unlocked" : "Unlocks"} {formatDateTime(capsule.unlockAt)}
      </p>

      <div className="capsule-card-actions">
        <button type="button" onClick={() => onView(capsule)}>
          {unlocked ? "Open" : "View"}
        </button>
        {capsule.visibility === "public" && (
          <button type="button" onClick={handleShare}>
            {copied ? "Copied!" : "🔗 Share"}
          </button>
        )}
        <button type="button" onClick={() => onDelete(capsule)}>
          Delete
        </button>
      </div>
    </div>
  );
}

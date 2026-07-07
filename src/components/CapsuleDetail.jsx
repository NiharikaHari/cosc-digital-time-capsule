import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { formatDateTime, isUnlocked } from "../utils/dateUtils";
import { buildShareUrl } from "../utils/shareUtils";

export default function CapsuleDetail({ capsule, now, readOnly = false, onClose, showClose = true }) {
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
    <div className="capsule-detail">
      <h2 className="modal-title">{capsule.title}</h2>
      <p className="visibility-badge">{capsule.visibility === "public" ? "🌐 Public" : "🔐 Private"}</p>

      {!unlocked ? (
        <div className="capsule-detail-locked">
          <p className="capsule-detail-locked-icon" aria-hidden="true">
            🔒
          </p>
          <p>This capsule is sealed until {formatDateTime(capsule.unlockAt)}.</p>
          <CountdownTimer unlockAt={capsule.unlockAt} now={now} />
        </div>
      ) : (
        <div className="capsule-detail-content">
          <p className="capsule-detail-message">{capsule.message}</p>

          {capsule.notes && <p className="capsule-detail-notes">{capsule.notes}</p>}

          {capsule.images?.length > 0 && (
            <div className="capsule-detail-images">
              {capsule.images.map((image) => (
                <img key={image.id} src={image.dataUrl} alt={image.name} />
              ))}
            </div>
          )}

          <p className="capsule-card-date">Unlocked {formatDateTime(capsule.unlockAt)}</p>
        </div>
      )}

      {!readOnly && capsule.visibility === "public" && (
        <button type="button" onClick={handleShare}>
          {copied ? "Link copied!" : "🔗 Copy share link"}
        </button>
      )}

      {showClose && (
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

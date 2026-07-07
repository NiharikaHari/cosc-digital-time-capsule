import useNow from "../hooks/useNow";
import CapsuleDial from "./CapsuleDial";
import { formatDateTime, isUnlocked } from "../utils/dateUtils";

export default function SharedCapsuleView({ capsule, onDismiss }) {
  const now = useNow();
  const unlocked = isUnlocked(capsule.unlockAt, now);

  return (
    <div className={`capsule-reveal-page ${unlocked ? "capsule-reveal-opened" : "capsule-reveal-sealed"}`}>
      <header className="capsule-reveal-topbar">
        <span className="capsule-reveal-brand">
          <span aria-hidden="true">⏳</span> Digital Time Capsule
        </span>
        <button type="button" className="capsule-reveal-exit" onClick={onDismiss}>
          My capsules
        </button>
      </header>

      <main className="capsule-reveal-main">
        {unlocked ? (
          <>
            <span className="capsule-reveal-pill">📬 Unsealed</span>
            <h1 className="capsule-reveal-title">{capsule.title}</h1>
            <p className="capsule-reveal-message">{capsule.message}</p>

            {capsule.notes && <p className="capsule-reveal-notes">{capsule.notes}</p>}

            {capsule.images?.length > 0 && (
              <div className="capsule-reveal-images">
                {capsule.images.map((image) => (
                  <img key={image.id} src={image.dataUrl} alt={image.name} />
                ))}
              </div>
            )}

            <p className="capsule-reveal-date">Unlocked {formatDateTime(capsule.unlockAt)}</p>
          </>
        ) : (
          <>
            <span className="capsule-reveal-pill">Opens in</span>
            <h1 className="capsule-reveal-title">{capsule.title}</h1>

            <CapsuleDial unlockAt={capsule.unlockAt} createdAt={capsule.createdAt} now={now} />

            <p className="capsule-reveal-tagline">
              Hang tight. This capsule stays sealed until {formatDateTime(capsule.unlockAt)}.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

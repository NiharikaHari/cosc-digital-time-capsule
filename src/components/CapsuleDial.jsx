import { getTimeRemaining } from "../utils/dateUtils";

const TICK_COUNT = 60;

// Draws a clock-style dial where the filled arc represents elapsed time
// between the capsule's creation and its unlock moment.
export default function CapsuleDial({ unlockAt, createdAt, now, size = 260 }) {
  const { days, hours, minutes, seconds } = getTimeRemaining(unlockAt, now);

  const unlockMs = new Date(unlockAt).getTime();
  const createdMs = createdAt ? new Date(createdAt).getTime() : unlockMs - 24 * 60 * 60 * 1000;
  const totalMs = Math.max(1, unlockMs - createdMs);
  const elapsedMs = Math.min(totalMs, Math.max(0, now.getTime() - createdMs));
  const filledTicks = Math.round((elapsedMs / totalMs) * TICK_COUNT);
  const radius = size / 2 - 10;

  const units = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <div className="capsule-hero-countdown">
      <div className="capsule-hero-digits">
        {units.map((unit) => (
          <div key={unit.label} className="capsule-hero-digit">
            <span className="capsule-hero-value">{String(unit.value).padStart(2, "0")}</span>
            <span className="capsule-hero-label">{unit.label}</span>
          </div>
        ))}
      </div>

      <div className="capsule-dial" style={{ width: size, height: size }}>
        {Array.from({ length: TICK_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`capsule-dial-tick${i < filledTicks ? " capsule-dial-tick-filled" : ""}`}
            style={{ transform: `rotate(${i * (360 / TICK_COUNT)}deg) translateY(-${radius}px)` }}
          />
        ))}
        <div className="capsule-dial-center">
          <span className="capsule-dial-center-icon" aria-hidden="true">⏳</span>
          <span className="capsule-dial-center-text">
            TIME
            <br />
            CAPSULE
          </span>
        </div>
      </div>
    </div>
  );
}

import { getTimeRemaining } from "../utils/dateUtils";

export default function CountdownTimer({ unlockAt, now, size = "md" }) {
  const { days, hours, minutes, seconds } = getTimeRemaining(unlockAt, now);

  const units = [
    { value: days, label: "d" },
    { value: hours, label: "h" },
    { value: minutes, label: "m" },
    { value: seconds, label: "s" },
  ];

  return (
    <div className={`countdown countdown-${size}`}>
      {units.map((unit) => (
        <span key={unit.label} className="countdown-unit">
          <span className="countdown-value">{String(unit.value).padStart(2, "0")}</span>
          <span className="countdown-label">{unit.label}</span>
        </span>
      ))}
    </div>
  );
}

export function isUnlocked(unlockAt, now = new Date()) {
  return now.getTime() >= new Date(unlockAt).getTime();
}

export function getTimeRemaining(unlockAt, now = new Date()) {
  const totalMs = Math.max(0, new Date(unlockAt).getTime() - now.getTime());
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
  };
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Rounds up to the next full minute so a capsule never unlocks earlier than picked.
export function getDefaultUnlockDateTimeLocal() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setSeconds(0, 0);
  return toDateTimeLocalValue(date.toISOString());
}

export function toDateTimeLocalValue(iso) {
  const date = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocalValue(value) {
  return new Date(value).toISOString();
}

export function getNowDateTimeLocal() {
  return toDateTimeLocalValue(new Date().toISOString());
}

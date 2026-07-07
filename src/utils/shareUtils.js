// Public capsules can be shared as a self-contained link: the whole capsule is
// base64-encoded into the URL hash, so opening it needs no backend or account.
export function encodeCapsuleForSharing(capsule) {
  const json = JSON.stringify(capsule);
  const base64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  ));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeSharedCapsule(encoded) {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    const capsule = JSON.parse(json);
    if (!capsule || typeof capsule !== "object" || !capsule.unlockAt) return null;
    return capsule;
  } catch {
    return null;
  }
}

export function buildShareUrl(capsule) {
  const encoded = encodeCapsuleForSharing(capsule);
  return `${location.origin}${location.pathname}#capsule=${encoded}`;
}

export function getSharedCapsuleFromLocation() {
  const match = location.hash.match(/^#capsule=(.+)$/);
  return match ? decodeSharedCapsule(match[1]) : null;
}

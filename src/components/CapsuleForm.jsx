import { useState } from "react";
import ImageUploader from "./ImageUploader";
import {
  fromDateTimeLocalValue,
  getDefaultUnlockDateTimeLocal,
  getNowDateTimeLocal,
  toDateTimeLocalValue,
} from "../utils/dateUtils";

export default function CapsuleForm({
  initialValues,
  heading = "New capsule",
  submitLabel = "Seal capsule",
  onSubmit,
  onCancel,
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [message, setMessage] = useState(initialValues?.message ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [images, setImages] = useState(initialValues?.images ?? []);
  const [unlockLocal, setUnlockLocal] = useState(
    initialValues?.unlockAt ? toDateTimeLocalValue(initialValues.unlockAt) : getDefaultUnlockDateTimeLocal()
  );
  const [visibility, setVisibility] = useState(initialValues?.visibility ?? "private");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your capsule a title.");
      return;
    }
    if (!message.trim()) {
      setError("Write a memory or message to seal inside.");
      return;
    }
    const unlockAt = fromDateTimeLocalValue(unlockLocal);
    if (Number.isNaN(new Date(unlockAt).getTime())) {
      setError("Pick a valid unlock date.");
      return;
    }
    if (new Date(unlockAt).getTime() <= Date.now()) {
      setError("Unlock date must be in the future.");
      return;
    }
    onSubmit({
      title: title.trim(),
      message: message.trim(),
      notes: notes.trim(),
      images,
      unlockAt,
      visibility,
    });
  }

  return (
    <form className="capsule-form" onSubmit={handleSubmit}>
      <h2 className="modal-title">{heading}</h2>

      <label className="form-field">
        Title
        <input
          type="text"
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A letter to future me"
        />
      </label>

      <label className="form-field">
        Message
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want your future self (or someone else) to know?"
          rows={4}
        />
      </label>

      <label className="form-field">
        Notes <span className="form-field-optional">(optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any extra context, links, or reminders"
          rows={2}
        />
      </label>

      <div className="form-field">
        Photos <span className="form-field-optional">(optional)</span>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      <label className="form-field">
        Unlocks on
        <input
          type="datetime-local"
          value={unlockLocal}
          min={getNowDateTimeLocal()}
          onChange={(e) => setUnlockLocal(e.target.value)}
        />
      </label>

      <fieldset className="form-field visibility-field">
        <legend>Visibility</legend>
        <label className="visibility-option">
          <input
            type="radio"
            name="visibility"
            value="private"
            checked={visibility === "private"}
            onChange={() => setVisibility("private")}
          />
          🔐 Private — only visible in your capsules
        </label>
        <label className="visibility-option">
          <input
            type="radio"
            name="visibility"
            value="public"
            checked={visibility === "public"}
            onChange={() => setVisibility("public")}
          />
          🌐 Public — can be shared via a link once unlocked
        </label>
      </fieldset>

      {error && <p className="form-error">{error}</p>}

      <div className="modal-actions">
        <button type="submit">{submitLabel}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

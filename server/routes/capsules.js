import { Router } from "express";
import crypto from "node:crypto";
import { db } from "../db.js";

const router = Router();

function validateCapsuleInput(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const unlockAt = body.unlockAt;

  if (!title) return "Give your capsule a title.";
  if (!message) return "Write a memory or message to seal inside.";
  if (!unlockAt || Number.isNaN(new Date(unlockAt).getTime())) {
    return "Pick a valid unlock date.";
  }
  if (new Date(unlockAt).getTime() <= Date.now()) {
    return "Unlock date must be in the future.";
  }
  return null;
}

router.get("/", (req, res) => {
  res.json(db.data.capsules);
});

router.post("/", async (req, res) => {
  const body = req.body ?? {};
  const validationError = validateCapsuleInput(body);
  if (validationError) return res.status(400).json({ error: validationError });

  const capsule = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: body.title.trim(),
    message: body.message.trim(),
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
    images: Array.isArray(body.images) ? body.images : [],
    unlockAt: body.unlockAt,
    visibility: body.visibility === "public" ? "public" : "private",
  };

  db.data.capsules.push(capsule);
  await db.write();
  res.status(201).json(capsule);
});

router.delete("/:id", async (req, res) => {
  const before = db.data.capsules.length;
  db.data.capsules = db.data.capsules.filter((c) => c.id !== req.params.id);
  if (db.data.capsules.length === before) {
    return res.status(404).json({ error: "Capsule not found." });
  }
  await db.write();
  res.status(204).end();
});

export default router;

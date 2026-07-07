import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import capsulesRouter from "./routes/capsules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json({ limit: "25mb" }));

app.use("/api/capsules", capsulesRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

const distPath = path.join(__dirname, "..", "dist");
app.use(express.static(distPath));

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "prestasi_db.json");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db file:", err);
    return [];
  }
}

function writeDb(data: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing db file:", err);
  }
}

function readConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { appsScriptUrl: "" };
    }
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  } catch (err) {
    return { appsScriptUrl: "" };
  }
}

function writeConfig(cfg: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing config file:", err);
  }
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// GET all prestasi
app.get("/api/prestasi", (_req, res) => {
  const data = readDb();
  res.json(data);
});

// POST add new prestasi
app.post("/api/prestasi", async (req, res) => {
  const newRecord = req.body;
  if (!newRecord) {
    return res.status(400).json({ error: "Missing record data" });
  }

  const current = readDb();
  // Check if record already exists
  const existingIdx = current.findIndex((item: any) => item.id === newRecord.id);
  if (existingIdx >= 0) {
    current[existingIdx] = newRecord;
  } else {
    current.unshift(newRecord);
  }
  writeDb(current);

  // Forward to Google Apps Script if configured
  const cfg = readConfig();
  if (cfg.appsScriptUrl) {
    try {
      fetch(cfg.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(newRecord),
      }).catch((err) => console.error("Auto forward to Apps Script failed:", err.message));
    } catch (e) {
      // ignore
    }
  }

  res.json({ status: "success", record: newRecord, total: current.length });
});

// PUT update bulk or single
app.put("/api/prestasi/bulk", (req, res) => {
  const records = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: "Data must be an array" });
  }
  writeDb(records);
  res.json({ status: "success", total: records.length });
});

app.put("/api/prestasi/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const current = readDb();
  let updatedRecord = null;

  const next = current.map((item: any) => {
    if (item.id === id) {
      updatedRecord = { ...item, ...updates, diupdatePada: new Date().toISOString() };
      return updatedRecord;
    }
    return item;
  });

  if (!updatedRecord) {
    return res.status(404).json({ error: "Record not found" });
  }

  writeDb(next);
  res.json({ status: "success", record: updatedRecord });
});

// DELETE single record
app.delete("/api/prestasi/:id", (req, res) => {
  const { id } = req.params;
  const current = readDb();
  const next = current.filter((item: any) => item.id !== id);
  writeDb(next);
  res.json({ status: "success", total: next.length });
});

// CONFIG Endpoints
app.get("/api/config", (_req, res) => {
  res.json(readConfig());
});

app.post("/api/config", (req, res) => {
  const cfg = req.body;
  writeConfig(cfg);
  res.json({ status: "success", config: cfg });
});

// Start Server with Vite Middleware in Development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server HIMPRES SMADA running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

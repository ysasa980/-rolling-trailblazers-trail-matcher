const express = require("express");
const cors = require("cors");

const trailsRouter = require("./routes/trails");
const matchRouter = require("./routes/match");
const optionsRouter = require("./routes/options");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "rtba-backend" }));

app.use("/api/trails", trailsRouter);
app.use("/api/match", matchRouter);
app.use("/api/options", optionsRouter);

// --- Future-hooks (POC architecture placeholders per A2 s.5.1) ---
// These endpoints exist so the frontend & future teams have a stable contract
// to build against; they are NOT implemented in Semester 1 (see A4 report s.4).
app.post("/api/ai-query", (req, res) => {
  res.status(501).json({
    error: "Not implemented in the Semester 1 POC.",
    hook: "AI Query Interface",
    note: "Reserved for the future natural-language query engine (A2 s.4.3)."
  });
});
app.post("/api/transport-plan", (req, res) => {
  res.status(501).json({
    error: "Not implemented in the Semester 1 POC.",
    hook: "Integrated Transport Planning",
    note: "Reserved for future transport-API integration (A2 s.4.3.1)."
  });
});
app.post("/api/trail-conditions", (req, res) => {
  res.status(501).json({
    error: "Not implemented in the Semester 1 POC.",
    hook: "Community Trail Condition Reports",
    note: "Reserved for future Waze-style trail degradation updates (A2 s.4.3.3)."
  });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`RTBA backend listening on http://localhost:${PORT}`);
});

module.exports = app;

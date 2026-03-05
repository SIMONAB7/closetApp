const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["https://closet-app-pi.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "50mb" }));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB error:", err.message));

const wardrobeSchema = new mongoose.Schema({
  key: String,
  data: { type: mongoose.Schema.Types.Mixed, default: [] },
}, { strict: false });
const Wardrobe = mongoose.model("Wardrobe", wardrobeSchema);

// Get items or outfits
app.get("/api/:key", async (req, res) => {
  try {
    const doc = await Wardrobe.findOne({ key: req.params.key });
    console.log("GET", req.params.key, doc ? doc.data.length : "not found");
    res.json(doc ? doc.data : []);
  } catch (err) {
    console.log("GET error:", err.message);
    res.json([]);
  }
});

app.post("/api/:key", async (req, res) => {
  try {
    await Wardrobe.findOneAndUpdate(
      { key: req.params.key },
      { data: req.body },
      { upsert: true, new: true }
    );
    console.log("POST", req.params.key, req.body.length, "items");
    res.json({ ok: true });
  } catch (err) {
    console.log("POST error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// keep-alive ping
setInterval(() => {
  fetch(`https://closetapp-production-3450.up.railway.app/api/ping`)
    .catch(() => {});
}, 5 * 60 * 1000); // ping every 5 minutes

app.get("/api/ping", (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 5001, () => console.log("Server running"));
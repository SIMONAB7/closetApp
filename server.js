const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["https://closet-app-pi.vercel.app", "http://localhost:3000"]
}));
app.options("/(.*)", cors());
app.use(express.json({ limit: "50mb" })); // large limit for base64 images

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const wardrobeSchema = new mongoose.Schema({
  key: String,
  data: mongoose.Schema.Types.Mixed,
});
const Wardrobe = mongoose.model("Wardrobe", wardrobeSchema);

// Get items or outfits
app.get("/api/:key", async (req, res) => {
  try {
    const doc = await Wardrobe.findOne({ key: req.params.key });
    res.json(doc ? doc.data : []);
  } catch (err) {
    res.json([]);
  }
});

// Save items or outfits
app.post("/api/:key", async (req, res) => {
  await Wardrobe.findOneAndUpdate(
    { key: req.params.key },
    { data: req.body },
    { upsert: true }
  );
  res.json({ ok: true });
});

app.listen(process.env.PORT || 5001, () => console.log("Server running"));
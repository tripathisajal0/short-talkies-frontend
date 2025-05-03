const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// Corrected CORS configuration
app.use(
  cors({
    origin: "https://short-talkies-frontend-1.onrender.com", // no trailing slash
    credentials: true, // allow cookies to be sent
  })
);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

// Route to track visits
app.get("/api/visit", async (req, res) => {
  try {
    const alreadyVisited = req.cookies.visited === "true";

    let doc = await Visit.findOne();
    if (!doc) {
      doc = new Visit({ count: 0 });
    }

    if (!alreadyVisited) {
      doc.count += 1;
      await doc.save();
      res.cookie("visited", "true", {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        sameSite: "Lax",
        secure: true, // secure is needed for cookies over HTTPS
      });
    }

    res.json({ count: doc.count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

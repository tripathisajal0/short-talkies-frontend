
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const { v4: uuidv4 } = require("uuid");
// require("dotenv").config();

// const app = express();
// app.use(cookieParser());
// app.use(express.json());

// // CORS setup for frontend access with credentials
// app.use(
//   cors({
//     origin: "https://short-talkies-frontend-1.onrender.com", // frontend URL
//     credentials: true, // allow cookies
//   })
// );

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// // Visit schema
// const visitSchema = new mongoose.Schema({
//   count: { type: Number, default: 0 },
// });

// const Visit = mongoose.model("Visit", visitSchema);

// // Unique visitor tracking route
// app.get("/api/visit", async (req, res) => {
//   try {
//     const visitorId = req.cookies.visitor_id;

//     let doc = await Visit.findOne();
//     if (!doc) {
//       doc = new Visit({ count: 0 });
//     }

//     if (!visitorId) {
//       // First-time visitor
//       const newVisitorId = uuidv4();
//       res.cookie("visitor_id", newVisitorId, {
//         maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
//         httpOnly: true,
//         sameSite: "Lax",
//         secure: true, // only works over HTTPS
//       });

//       doc.count += 1;
//       await doc.save();
//     }

//     res.json({ count: doc.count });
//   } catch (err) {
//     console.error("Error counting visits:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// CORS setup (Make sure your frontend URL is correct)
app.use(
  cors({
    origin: "https://short-talkies-frontend-1.onrender.com",
    credentials: true,
  })
);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Schema to store total count
const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});
const Visit = mongoose.model("Visit", visitSchema);

// Schema to store each unique visitor ID
const visitorSchema = new mongoose.Schema({
  uuid: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});
const Visitor = mongoose.model("Visitor", visitorSchema);

// Route to track unique visits
app.get("/api/visit", async (req, res) => {
  try {
    let visitorId = req.cookies.visitor_id;

    if (!visitorId) {
      // New visitor: generate ID and set cookie
      visitorId = uuidv4();
      res.cookie("visitor_id", visitorId, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "Lax",
        secure: true, // Required for HTTPS
      });
    }

    // Check if UUID already exists in DB
    const existingVisitor = await Visitor.findOne({ uuid: visitorId });

    if (!existingVisitor) {
      // New unique visitor: store UUID and increment count
      await Visitor.create({ uuid: visitorId });

      let visitDoc = await Visit.findOne();
      if (!visitDoc) {
        visitDoc = new Visit({ count: 1 });
      } else {
        visitDoc.count += 1;
      }
      await visitDoc.save();
    }

    // Get current count and return
    const visitDoc = await Visit.findOne();
    res.json({ count: visitDoc ? visitDoc.count : 0 });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

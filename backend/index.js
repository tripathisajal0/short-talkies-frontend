// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const app = express();
// app.use(cookieParser());
// app.use(express.json());

// // Corrected CORS configuration
// app.use(
//   cors({
//     origin: "https://short-talkies-frontend-1.onrender.com", // no trailing slash
//     credentials: true, // allow cookies to be sent
//   })
// );

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const visitSchema = new mongoose.Schema({
//   count: { type: Number, default: 0 },
// });

// const Visit = mongoose.model("Visit", visitSchema);

// // Route to track visits
// app.get("/api/visit", async (req, res) => {
//   try {
//     const alreadyVisited = req.cookies.visited === "true";

//     let doc = await Visit.findOne();
//     if (!doc) {
//       doc = new Visit({ count: 0 });
//     }

//     if (!alreadyVisited) {
//       doc.count += 1;
//       await doc.save();
//       res.cookie("visited", "true", {
//         maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
//         httpOnly: true,
//         sameSite: "Lax",
//         secure: true, // secure is needed for cookies over HTTPS
//       });
//     }

//     res.json({ count: doc.count });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// mongoose.connection.once("open", () => {
//   console.log("Connected to MongoDB");
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

// CORS setup for frontend access with credentials
app.use(
  cors({
    origin: "https://short-talkies-frontend-1.onrender.com", // frontend URL
    credentials: true, // allow cookies
  })
);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Visit schema
const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

// Unique visitor tracking route
app.get("/api/visit", async (req, res) => {
  try {
    const visitorId = req.cookies.visitor_id;

    let doc = await Visit.findOne();
    if (!doc) {
      doc = new Visit({ count: 0 });
    }

    if (!visitorId) {
      // First-time visitor
      const newVisitorId = uuidv4();
      res.cookie("visitor_id", newVisitorId, {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "Lax",
        secure: true, // only works over HTTPS
      });

      doc.count += 1;
      await doc.save();
    }

    res.json({ count: doc.count });
  } catch (err) {
    console.error("Error counting visits:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


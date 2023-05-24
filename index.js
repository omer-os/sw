// app.js
const express = require("express");
const functions = require("firebase-functions");
const cors = require("cors");

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: "../.env.production" });
} else {
  require("dotenv").config();
}

const app = express();

// Allow CORS from any source
app.use(cors());

const restaurantRoutes = require("./routes/restaurant");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const analyticsRoutes = require("./routes/analytics");
const feedbackRoutes = require("./routes/feedback");
const testRoutes = require("./routes/test");
// Change the region for the Cloud Function
const region = "europe-west3";
app.use(express.json());

app.use("/restaurants", restaurantRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/", testRoutes);

exports.api = functions.region(region).https.onRequest(app);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
  });
}

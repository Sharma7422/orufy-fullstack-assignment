const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");

app.get("/", (req, res) => {
  res.send("Welcome to orufy_assignment!");
});



app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

module.exports = app;

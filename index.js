const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const heroRoutes = require("./routes/heroRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const albumRoutes = require("./routes/albumRoutes");
const imageRoutes = require("./routes/imageRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/heroes", heroRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);

connectDB();
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

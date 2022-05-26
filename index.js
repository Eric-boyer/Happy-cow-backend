const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");
require ("dotenv").config();

const app = express();
app.use(cors());
app.use(formidable());


mongoose.connect(process.env.MONGODB_CONNECT);
const userRoutes = require("./routes/user");
app.use(userRoutes);



app.get("/", (req, res) => {
  res.json("welcom to my projet");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "page introuvable" });
});
app.listen(process.env.PORT, () => {
  console.log("server started");
});

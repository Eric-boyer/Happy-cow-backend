const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(formidable());

mongoose.connect("mongodb://localhost/projet-signup");
const userRoutes = require("./routes/user");
app.use(userRoutes);



app.get("/", (req, res) => {
  res.json("welcom to my projet");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "page introuvable" });
});
app.listen(4000, () => {
  console.log("server started");
});

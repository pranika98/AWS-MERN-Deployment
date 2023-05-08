const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

// Making Build Folder as Public
app.use(express.static(path.join(__dirname, "client", "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.get("/api/other-link", (req, res) => {
  return res.json({ message: "Other URL" });
});
app.get("/api", (req, res) => {
  return res.json({ message: "Root URL" });
});

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, function () {
  console.log("Server listening on port " + port);
});

module.exports = app;

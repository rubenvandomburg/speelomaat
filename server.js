const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let unlockRequested = false;

app.get("/", (req, res) => {
  res.send("Speel-o-maat locker server running");
});

app.get("/status", (req, res) => {
  res.json({ unlockRequested });
});

app.post("/unlock", (req, res) => {
  unlockRequested = true;
  console.log("Unlock requested");
  res.json({ unlockRequested });
});

app.post("/reset", (req, res) => {
  unlockRequested = false;
  console.log("Reset requested");
  res.json({ unlockRequested });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});

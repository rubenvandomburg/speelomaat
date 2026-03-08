const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const AIO_USERNAME = process.env.AIO_USERNAME;
const AIO_KEY = process.env.AIO_KEY;
const FEED_KEY = process.env.FEED_KEY || "locker-control";

const ADA_URL = `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${FEED_KEY}/data`;

async function writeToAdafruit(value) {
  const response = await fetch(ADA_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AIO-Key": AIO_KEY
    },
    body: JSON.stringify({ value })
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Adafruit IO error ${response.status}: ${text}`);
  }

  return text;
}

app.get("/", (req, res) => {
  res.send("Speel-o-maat bridge running");
});

app.post("/request-code", async (req, res) => {
  try {
    const result = await writeToAdafruit("request_code");
    res.json({ ok: true, action: "request_code", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/digit/:n", async (req, res) => {
  try {
    const n = req.params.n;

    if (!["1", "2", "3", "4", "5", "6"].includes(n)) {
      return res.status(400).json({ ok: false, error: "Digit must be 1-6" });
    }

    const result = await writeToAdafruit(`entered:${n}`);
    res.json({ ok: true, action: `entered:${n}`, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/reset", async (req, res) => {
  try {
    const result = await writeToAdafruit("locked");
    res.json({ ok: true, action: "locked", result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Bridge running on port ${port}`);
});

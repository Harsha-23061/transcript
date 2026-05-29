const express = require("express");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.static("public"));

app.post("/transcribe", upload.single("audio"), async (req, res) => {

  try {

    const transcription =
      await client.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-1",
        language: "te"
      });

    fs.unlinkSync(req.file.path);

    res.json({
      transcript: transcription.text
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

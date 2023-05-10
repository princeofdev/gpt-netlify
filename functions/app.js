const express = require("express");
const serverless = require("serverless-http");
const { spawn } = require("child_process");

const app = express();
const router = express.Router();

router.post("/webhook", (req, res) => {
  const data = req.body;
  const process = spawn("python", ["-c", `print("${data}")`]);
  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    res.status(200).json({ message: data.toString() });
  });
  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.use("/.netlify/functions/app", router);

module.exports.handler = serverless(app);

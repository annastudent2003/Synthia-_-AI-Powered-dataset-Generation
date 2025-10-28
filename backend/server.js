import express from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import generateRoute from "./routes/generate.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));


app.use("/downloads", express.static(path.join(process.cwd(), "backend", "generated")));


app.use("/generate", generateRoute);

app.get("/", (req, res) => res.send("✅ Backend running and connected to Python ML pipeline"));

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Backend running on port ${PORT}`));

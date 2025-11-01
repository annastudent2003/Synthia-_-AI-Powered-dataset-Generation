import express from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import archiver from "archiver"; 
const router = express.Router();

function zipDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => resolve());
    archive.on("error", (err) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

router.post("/preview", async (req, res) => {
  try {
    const inputImagesDir = path.join(process.cwd(), "python_ml", "data", "input", "images");
    const inputFiles = fs.readdirSync(inputImagesDir);
    const imagePreviews = inputFiles.slice(0, 10).map(file => ({
      url: `http://localhost:5000/images/${file}`,
    }));

    res.json({
      message: "Preview images loaded successfully",
      images: imagePreviews,
    });
  } catch (err) {
    console.error("❌ Preview Error:", err);
    res.status(500).json({ error: "Failed to load preview images" });
  }
});



router.post("/", async (req, res) => {
  try {
       const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const pythonScript = path.join(process.cwd(), "python_ml","auto_label", "annotate_pipeline.py");
    const outputDir = path.join(process.cwd(), "python_ml", "data", "output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const masksDir = path.join(outputDir, "masks");
    const polysDir = path.join(outputDir, "polygons");
    const depthDir = path.join(outputDir, "depth");
    const cocoPath = path.join(outputDir, "coco");
    const checkpointPath = path.join(process.cwd(), "backend", "python_ml","auto_label", "sam_vit_b.pth");
    const datasetFolder = outputDir;
    const zipPath = path.join(outputDir, "dataset.zip");


    console.log(`🧠 Running Python ML pipeline for: "${prompt}"`);

    const pythonProcess = spawn("python", [`"${pythonScript}"`, prompt, 
      outputDir,
      masksDir,
      polysDir,
      depthDir,
      cocoPath,
      checkpointPath],{ shell: true });


    let pythonLogs = "";
    let pythonErrors = "";

    pythonProcess.stdout.on("data", (data) => {
      const msg = data.toString();
      pythonLogs += msg;
      console.log(`PYTHON: ${msg}`);
    });

    pythonProcess.stderr.on("data", (data) => {
      const err = data.toString();
      pythonErrors += err;
      console.error(`PYTHON ERROR: ${err}`);
    });

    pythonProcess.on("close", async (code) => {
      console.log(`🐍 Python exited with code ${code}`);
      console.log("Zipping contents of:", datasetFolder);
      console.log("Python logs:\n", pythonLogs);


      if (code !== 0) {
        return res.status(500).json({ error: "Python script failed", details: pythonErrors });
      }

      console.log("📦 Zipping generated dataset...");
      await zipDirectory(datasetFolder, zipPath);
      console.log(`✅ Dataset zipped at: ${zipPath}`);


      res.json({
        message: "Dataset zipped successfully",
        datasetZip: "/downloads/dataset.zip",
      });

    });

  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

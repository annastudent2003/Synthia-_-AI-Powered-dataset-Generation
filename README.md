# 🧩 SYNTHIA – AI-Based Synthetic Dataset Generator

SYNTHIA is a full-stack AI application that generates **auto-labeled synthetic image datasets** from a simple text prompt.  
It combines **React.js (frontend)**, **Node.js + Express (backend)**, and a **Python ML pipeline** for image generation and annotation.

---

## 🚀 Features
- 🎯 Enter a **text prompt** (e.g., “cats in the park”)  
- 🧠 Backend runs a **Python ML pipeline** (`annotate_pipeline.py`)  
- 🖼️ Generates multiple synthetic images and auto-labels them  
- 📦 Zips all labeled images into a ready-to-download dataset  
- 💾 Frontend shows the first 10 preview images and allows **“Download All”**

---

## 🧱 Project Structure

## ⚙️ Installation and Setup
### 🧩 1. Clone the Repository
```bash
git clone https://github.com/your-username/synthia.git
cd synthia
```

### 💻 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 🖥️ 3. Backend Setup
```bash
cd ../backend
npm install express cors body-parser archiver
```

If you use ES module imports (import ... from), add this to your package.json:
```json
"type": "module"
```

Then start the server:
```bash
node server.js
```

### 🧠 4. Python ML Setup
The ML code inside backend/python_ml runs automatically when triggered by the backend.
Install the required Python dependencies:
```bash
pip install torch torchvision torchaudio
pip install opencv-python imageio numpy pillow
pip install git+https://github.com/facebookresearch/segment-anything.git
pip install timm
```

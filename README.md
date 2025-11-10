# 🧩 SYNTHIA – AI-Based Synthetic Dataset Generator

SYNTHIA is a full-stack AI application that generates **auto-labeled synthetic image datasets** from a simple text prompt.  
It combines **React.js (frontend)**, **Node.js + Express (backend)**, and a **Python ML pipeline** for image generation and annotation.

![image alt](https://github.com/annastudent2003/Synthia-_-AI-Powered-dataset-Generation/blob/29254f750ad5860fa7b11ba110eba5ddab8e5444/Images/Screenshot%202025-11-10%20084547.png)

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

📝 Note: The system currently runs on CPU-based environments (no GPU required).

## 🧰 Tech Stack

**Frontend**  -  React.js, HTML, CSS, JavaScript               

**Backend** -  Node.js, Express.js, Body-Parser, Archiver    

**ML Engine**  -  Python, PyTorch, SAM, MiDaS, OpenCV           

**Communication**  -  REST API (JSON)                               

**Output**  -  Labeled image dataset (COCO JSON, PNG format) 

## 🧪 API Reference
### POST /generate
#### Request Body:
```json
{ "prompt": "cars on the road" }
```

#### Response:
```json
{
  "message": "Dataset generated successfully",
  "images": [
    { "url": "https://picsum.photos/400?random=12" },
    ...
  ],
  "datasetZip": "/downloads/dataset.zip"
}
```

## 🔮 Future Scope
1. Deploy the ML pipeline on GPU-based or cloud environments to enable faster image generation and annotation.

2. Integrate advanced generative models such as Stable Diffusion or GANs for more realistic image synthesis.

3. Implement user authentication, prompt history, and dataset management features.

4. Expand into a web service platform allowing developers to request datasets through APIs.

5. Optimize backend for batch processing and real-time dataset streaming.

## Output

https://github.com/user-attachments/assets/5f7a1ef6-829b-460c-a998-7b90912d5bb1




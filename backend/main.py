from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from concurrent.futures import ThreadPoolExecutor
import io
import base64
import logging
from typing import List, Optional
from PIL import Image, ImageDraw
import numpy as np
from deepface import DeepFace
from ultralytics import YOLO

# ---------------- Logging ----------------
logging.basicConfig(
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger("AI-Border-Surveillance")

# ---------------- FastAPI ----------------
app = FastAPI(title="AI Border Surveillance API", version="1.1")

# ---------------- Model Loading ----------------
try:
    logger.info("Loading YOLOv5 model...")
    model = YOLO("yolov5s.pt")  # swap with custom weights if needed
    logger.info("YOLO model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading YOLO model: {e}")
    raise RuntimeError("Failed to load YOLO model")

# Thread pool for DeepFace (to avoid blocking)
executor = ThreadPoolExecutor(max_workers=2)

# ---------------- Pydantic Schemas ----------------
class DetectionObject(BaseModel):
    label: str
    box: List[int]
    confidence: float

class DetectionResponse(BaseModel):
    detected_image: str  # base64 string
    objects: List[DetectionObject]
    sentiment: Optional[str] = None
    alarm: bool

# ---------------- Detection Logic ----------------
def detect_objects(image: Image.Image):
    """Run YOLO object detection and draw bounding boxes"""
    img_array = np.array(image)
    results = model(img_array, verbose=False)

    detected_image = image.copy()
    draw = ImageDraw.Draw(detected_image)
    detected_objects = []

    if not results or not results[0].boxes:
        return detected_image, []

    for detection in results[0].boxes.data.tolist():
        x1, y1, x2, y2, confidence, class_id = detection
        x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
        class_id = int(class_id)
        class_name = results[0].names.get(class_id, "unknown")

        if confidence > 0.5:
            color, label = "green", class_name

            if class_name == "person":
                color, label = "red", "Human"
            elif class_name in ["knife", "gun", "pistol", "rifle"]:
                color, label = "blue", "Weapon"

            draw.rectangle([x1, y1, x2, y2], outline=color, width=3)

            detected_objects.append(
                {"label": label, "box": [x1, y1, x2, y2], "confidence": float(confidence)}
            )

    return detected_image, detected_objects


def analyze_face(image: Image.Image):
    """Run DeepFace analysis for emotion"""
    img_array = np.array(image.convert("RGB"))
    try:
        result = DeepFace.analyze(
            img_array, actions=["emotion"], enforce_detection=False
        )
        if isinstance(result, list):
            result = result[0]
        return result.get("dominant_emotion", "Unknown")
    except Exception as e:
        logger.warning(f"Face analysis error: {e}")
        return "No Face Detected"

# ---------------- API Endpoint ----------------
@app.post("/detect/", response_model=DetectionResponse)
async def detect(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    detected_image, objects = detect_objects(image)

    # Convert detected image to Base64 (easier for frontend use)
    img_byte_arr = io.BytesIO()
    detected_image.save(img_byte_arr, format="PNG")
    detected_img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode("utf-8")

    sentiment = None
    for obj in objects:
        if obj["label"] == "Human":
            x1, y1, x2, y2 = obj["box"]
            face_img = image.crop((x1, y1, x2, y2))
            sentiment = await app.loop.run_in_executor(executor, analyze_face, face_img)
            break

    has_weapon = any(obj["label"] == "Weapon" for obj in objects)

    return JSONResponse(
        content={
            "detected_image": detected_img_base64,
            "objects": objects,
            "sentiment": sentiment,
            "alarm": has_weapon,
        }
    )

# ---------------- Run Server ----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

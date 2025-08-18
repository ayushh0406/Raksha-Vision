from fastapi import FastAPI, File, UploadFile
import io
from PIL import Image, ImageDraw
import numpy as np
from deepface import DeepFace
import logging
from ultralytics import YOLO

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Border Surveillance API")

# Load YOLO model
logger.info("Loading YOLOv5 model...")
model = YOLO("yolov5s.pt")  # lightweight, fast model
logger.info("Model loaded successfully!")

# Object Detection
def detect_objects(image: Image.Image):
    img_array = np.array(image)
    results = model(img_array)

    detected_image = image.copy()
    draw = ImageDraw.Draw(detected_image)
    detected_objects = []

    for detection in results[0].boxes.data.tolist():
        x1, y1, x2, y2, confidence, class_id = detection
        x1, y1, x2, y2 = map(int, (x1, y1, x2, y2))
        class_id = int(class_id)
        class_name = results[0].names[class_id]

        if confidence > 0.5:
            color = "green"
            label = class_name

            if class_name == "person":
                color = "red"
                label = "Human"
            elif class_name in ["knife", "gun", "pistol"]:
                color = "blue"
                label = "Weapon"

            draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
            detected_objects.append({"label": label, "box": [x1, y1, x2, y2]})

    return detected_image, detected_objects

# Face & Emotion Analysis
def analyze_face(image: Image.Image):
    img_array = np.array(image.convert('RGB'))
    try:
        result = DeepFace.analyze(img_array, actions=['emotion'], enforce_detection=False)
        return result[0]["dominant_emotion"]
    except Exception as e:
        logger.error(f"Face analysis error: {e}")
        return "No Face Detected"

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    detected_image, objects = detect_objects(image)

    # Convert detected image to hex
    img_byte_arr = io.BytesIO()
    detected_image.save(img_byte_arr, format='PNG')
    detected_img_hex = img_byte_arr.getvalue().hex()

    sentiment = None
    for obj in objects:
        if obj["label"] == "Human":
            x1, y1, x2, y2 = obj["box"]
            try:
                face_img = image.crop((x1, y1, x2, y2))
                sentiment = analyze_face(face_img)
                break
            except Exception as e:
                logger.error(f"Error cropping face region: {e}")
                sentiment = "Analysis Failed"

    has_weapon = any(obj["label"] == "Weapon" for obj in objects)

    return {
        "detected_image": detected_img_hex,
        "objects": objects,
        "sentiment": sentiment,
        "alarm": has_weapon
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

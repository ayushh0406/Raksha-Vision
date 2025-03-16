from fastapi import FastAPI, File, UploadFile
import io
from PIL import Image, ImageDraw
import cv2
import numpy as np
from deepface import DeepFace
import logging
from ultralytics import YOLO
import torch

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

# Load YOLOv5 model
model = YOLO("yolov5s.pt")  # or use "yolov5m.pt" for better accuracy

# Object Detection using YOLOv5
def detect_objects(image):
    # Convert PIL image to numpy array for YOLO
    img_array = np.array(image)
    
    # Run YOLOv5 detection
    results = model(img_array)
    
    # Create a copy of the image for drawing
    detected_image = image.copy()
    draw = ImageDraw.Draw(detected_image)
    
    detected_objects = []
    
    # Process detection results
    for detection in results[0].boxes.data.tolist():
        x1, y1, x2, y2, confidence, class_id = detection
        
        # Convert to integers
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        class_id = int(class_id)
        
        # Get class name
        class_name = results[0].names[class_id]
        
        # Only process if confidence is high enough
        if confidence > 0.5:
            # Draw bounding box
            if class_name == "person":
                draw.rectangle([x1, y1, x2, y2], outline="red", width=3)
                detected_objects.append({"label": "Human", "box": [x1, y1, x2, y2]})
            elif class_name in ["knife", "gun", "pistol"]:
                draw.rectangle([x1, y1, x2, y2], outline="blue", width=3)
                detected_objects.append({"label": "Weapon", "box": [x1, y1, x2, y2]})
            else:
                draw.rectangle([x1, y1, x2, y2], outline="green", width=3)
                detected_objects.append({"label": class_name, "box": [x1, y1, x2, y2]})
    
    return detected_image, detected_objects

# Face & Sentiment Analysis
def analyze_face(image):
    # Convert PIL image to RGB numpy array
    img_array = np.array(image.convert('RGB'))
    
    try:
        # Correct way to call DeepFace.analyze
        result = DeepFace.analyze(img_array, actions=['emotion'], enforce_detection=False)
        return result[0]["dominant_emotion"]
    except Exception as e:
        print(f"Error in face analysis: {str(e)}")
        return "No Face Detected"

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Run object detection with YOLOv5
    detected_image, objects = detect_objects(image)

    # Convert detected image to hex
    img_byte_arr = io.BytesIO()
    detected_image.save(img_byte_arr, format='PNG')
    detected_img_hex = img_byte_arr.getvalue().hex()

    # Face Sentiment Analysis (Only if human is detected)
    sentiment = None
    for obj in objects:
        if obj["label"] == "Human":
            # Extract just the face region using the bounding box
            x1, y1, x2, y2 = obj["box"]
            try:
                face_img = image.crop((x1, y1, x2, y2))
                sentiment = analyze_face(face_img)
                break  # Process just the first human for now
            except Exception as e:
                print(f"Error processing face region: {str(e)}")
                sentiment = "Analysis Failed"

    # Check for weapons to trigger alarm
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
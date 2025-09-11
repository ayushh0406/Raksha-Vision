
import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import base64

def read_image_from_bytesio(file_storage):
    """
    Accepts a Flask FileStorage (request.files['image']) and returns an OpenCV BGR image.
    """
    image = Image.open(file_storage.stream).convert("RGB")
    arr = np.array(image)
    # Pillow gives RGB, convert to BGR for OpenCV
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

def bgr_to_base64(bgr_img, fmt=".jpg"):
    _, buffer = cv2.imencode(fmt, bgr_img)
    b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"

def crop_box(img, box):
    """
    box = [x1, y1, x2, y2]
    """
    h, w = img.shape[:2]
    x1 = max(0, int(box[0]))
    y1 = max(0, int(box[1]))
    x2 = min(w - 1, int(box[2]))
    y2 = min(h - 1, int(box[3]))
    return img[y1:y2, x1:x2]

def draw_boxes(img, results):
    """
    results: list of dicts with 'box' and 'label' optional
    """
    img_copy = img.copy()
    for r in results:
        box = list(map(int, r.get("box", [0,0,0,0])))
        label = r.get("label", "")
        cv2.rectangle(img_copy, (box[0], box[1]), (box[2], box[3]), (0,255,0), 2)
        if label:
            cv2.putText(img_copy, label, (box[0], max(15, box[1]-10)),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 1, cv2.LINE_AA)
    return img_copy

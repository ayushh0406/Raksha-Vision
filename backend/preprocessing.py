

import cv2
import numpy as np

def align_face(image, landmarks):
    # Example: align eyes to horizontal line
    left_eye, right_eye = landmarks['left_eye'], landmarks['right_eye']
    # ... compute angle, rotate image
    return aligned_img

def preprocess(image):
    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    return img.astype(np.float32)

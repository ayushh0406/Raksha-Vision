

import cv2
from config import FACE_DETECT_MODEL_PATH

class FaceDetector:
    def __init__(self):
        self.net = cv2.dnn.readNet(FACE_DETECT_MODEL_PATH)

    def detect(self, image):
        # returns list of bounding boxes, landmarks
        blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), (104, 117, 123))
        self.net.setInput(blob)
        detections = self.net.forward()
        # parse detections...
        return boxes, landmarks

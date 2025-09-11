
import cv2
import numpy as np
from config import FACE_DETECTOR_MODEL, FACE_DETECTOR_PROTO, FACE_CONF_THRESHOLD
from logger import get_logger
import os

logger = get_logger(__name__)

class FaceDetector:
    def __init__(self, model_path=FACE_DETECTOR_MODEL, proto_path=FACE_DETECTOR_PROTO, conf_threshold=FACE_CONF_THRESHOLD):
        self.conf_threshold = conf_threshold
        if os.path.exists(model_path) and os.path.exists(proto_path):
            try:
                self.net = cv2.dnn.readNetFromCaffe(proto_path, model_path)
                logger.info("Loaded Caffe face detector.")
            except Exception as e:
                logger.warning("Failed to load Caffe detector: %s", e)
                self.net = None
        else:
            logger.warning("Detector model/proto not found. Using simple Haar cascade fallback.")
            cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
            self.net = None
            self.cascade = cv2.CascadeClassifier(cascade_path)

    def detect(self, img_bgr):
        """
        Returns: boxes list and confidences list
        box format: [x1, y1, x2, y2]
        """
        h, w = img_bgr.shape[:2]
        boxes = []
        scores = []
        if self.net is not None:
            blob = cv2.dnn.blobFromImage(cv2.resize(img_bgr, (300,300)), 1.0,
                                         (300,300), (104.0, 177.0, 123.0))
            self.net.setInput(blob)
            detections = self.net.forward()
            for i in range(detections.shape[2]):
                conf = float(detections[0,0,i,2])
                if conf > self.conf_threshold:
                    box = detections[0,0,i,3:7] * np.array([w, h, w, h])
                    (x1,y1,x2,y2) = box.astype("int")
                    boxes.append([x1,y1,x2,y2])
                    scores.append(conf)
        else:
            gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
            faces = self.cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30,30))
            for (x, y, fw, fh) in faces:
                boxes.append([x, y, x+fw, y+fh])
                scores.append(1.0)
        return boxes, scores

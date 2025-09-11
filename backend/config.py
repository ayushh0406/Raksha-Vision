

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')
FACE_DETECT_MODEL_PATH = os.path.join(MODEL_DIR, 'face_detector.pt')
EMOTION_MODEL_PATH = os.path.join(MODEL_DIR, 'emotion_classifier.pt')

# thresholds
FACE_RECOG_THRESHOLD = 0.6

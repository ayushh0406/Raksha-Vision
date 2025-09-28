import cv2
import numpy as np
import logging
from deepface import DeepFace
from ultralytics import YOLO
from preprocessing import preprocess

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FaceAnalyzer:
    def __init__(self, detector_model="yolov8n-face.pt", embedding_model="Facenet"):
        """
        Face Analysis Module
        :param detector_model: Path to YOLO face detection model
        :param embedding_model: DeepFace supported model ("Facenet", "ArcFace", "VGG-Face", etc.)
        """
        logger.info("Loading YOLO face detector...")
        self.detector = YOLO(detector_model)

        logger.info(f"Loading DeepFace embedding model: {embedding_model}")
        self.embedding_model = embedding_model

    def detect_faces(self, frame):
        """
        Detects faces using YOLO
        :param frame: Input image (BGR)
        :return: list of bounding boxes [x, y, w, h]
        """
        results = self.detector(frame)
        bboxes = []

        for r in results[0].boxes:
            x1, y1, x2, y2 = map(int, r.xyxy[0])
            w, h = x2 - x1, y2 - y1
            bboxes.append((x1, y1, w, h))

        logger.info(f"Detected {len(bboxes)} face(s)")
        return bboxes

    def extract_face(self, frame, bbox, landmarks=None):
        """
        Crops and preprocesses a face from the frame
        :param frame: Input image
        :param bbox: (x, y, w, h)
        :param landmarks: Optional facial landmarks for alignment
        """
        x, y, w, h = bbox
        face = frame[y:y + h, x:x + w]

        # Preprocess with alignment + normalization
        processed_face = preprocess(face, landmarks=landmarks, target_size=(224, 224))
        return processed_face

    def get_embeddings(self, face_img):
        """
        Extracts embeddings using DeepFace
        :param face_img: Preprocessed face image (RGB, normalized)
        :return: Face embedding vector
        """
        try:
            # DeepFace expects BGR image, so convert back
            img_bgr = (face_img * 255).astype(np.uint8)
            img_bgr = cv2.cvtColor(img_bgr, cv2.COLOR_RGB2BGR)

            embedding = DeepFace.represent(img_path=img_bgr, model_name=self.embedding_model, enforce_detection=False)
            return np.array(embedding[0]["embedding"])
        except Exception as e:
            logger.error(f"Embedding extraction failed: {e}")
            return None

    def analyze_frame(self, frame):
        """
        Full pipeline: Detect -> Crop -> Preprocess -> Embedding
        :param frame: Input image (BGR)
        :return: list of dict {bbox, embedding}
        """
        bboxes = self.detect_faces(frame)
        results = []

        for bbox in bboxes:
            face_img = self.extract_face(frame, bbox)
            embedding = self.get_embeddings(face_img)

            if embedding is not None:
                results.append({"bbox": bbox, "embedding": embedding})

        return results


# For testing module
if __name__ == "__main__":
    analyzer = FaceAnalyzer()

    img_path = "test_face.jpg"  # Replace with your test image
    frame = cv2.imread(img_path)

    if frame is None:
        logger.error("Image not found, please provide a valid path.")
    else:
        faces_data = analyzer.analyze_frame(frame)
        logger.info(f"Processed {len(faces_data)} face(s).")

        # Draw detections
        for f in faces_data:
            x, y, w, h = f["bbox"]
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

        cv2.imshow("Face Analysis", frame)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

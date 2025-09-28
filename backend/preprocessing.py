import cv2
import numpy as np

def align_face(image, landmarks):
    """
    Aligns the face in the image based on eye coordinates.
    landmarks: dict with keys 'left_eye' and 'right_eye' -> (x, y)
    """
    left_eye = landmarks.get("left_eye")
    right_eye = landmarks.get("right_eye")

    if left_eye is None or right_eye is None:
        # Agar landmarks missing hain toh return original image
        return image

    # Eye center coordinates
    left_eye_center = np.array(left_eye, dtype=np.float32)
    right_eye_center = np.array(right_eye, dtype=np.float32)

    # Compute angle between eyes
    dx = right_eye_center[0] - left_eye_center[0]
    dy = right_eye_center[1] - left_eye_center[1]
    angle = np.degrees(np.arctan2(dy, dx))

    # Compute center between eyes
    eyes_center = ((left_eye_center[0] + right_eye_center[0]) / 2,
                   (left_eye_center[1] + right_eye_center[1]) / 2)

    # Get rotation matrix for affine transform
    rotation_matrix = cv2.getRotationMatrix2D(eyes_center, angle, 1.0)

    # Rotate image to align eyes horizontally
    aligned_img = cv2.warpAffine(
        image,
        rotation_matrix,
        (image.shape[1], image.shape[0]),
        flags=cv2.INTER_CUBIC
    )

    return aligned_img


def preprocess(image, landmarks=None, target_size=(224, 224), equalize_hist=False):
    """
    Preprocess input image for model inference:
    1. Optionally align face
    2. Convert BGR -> RGB
    3. Resize to target size
    4. Normalize [0,1]
    5. Optionally apply histogram equalization (better contrast)
    """
    # Step 1: Face alignment (agar landmarks diye hain toh)
    if landmarks is not None:
        image = align_face(image, landmarks)

    # Step 2: Convert BGR -> RGB
    img = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Step 3: Resize
    img = cv2.resize(img, target_size)

    # Step 4: Optional histogram equalization (per channel)
    if equalize_hist:
        img_yuv = cv2.cvtColor(img, cv2.COLOR_RGB2YUV)
        img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])  # Y channel equalized
        img = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2RGB)

    # Step 5: Normalize [0,1]
    img = img.astype(np.float32) / 255.0

    return img

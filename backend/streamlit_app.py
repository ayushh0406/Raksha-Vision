import streamlit as st
import requests
import io
from PIL import Image

st.title("🔍 AI-Powered Border Surveillance System")

uploaded_file = st.file_uploader("Upload an Image for Detection", type=["jpg", "png"])

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)

    # Send image to FastAPI
    files = {"file": uploaded_file.getvalue()}
    response = requests.post("http://127.0.0.1:8000/detect/", files=files)

    if response.status_code == 200:
        result = response.json()
        detected_img_hex = result.get("detected_image")
        detected_objects = result.get("objects", [])
        sentiment = result.get("sentiment", "No Sentiment Detected")
        alarm = result.get("alarm", False)

        # Display detected image
        if detected_img_hex:
            detected_img_bytes = bytes.fromhex(detected_img_hex)
            detected_img = Image.open(io.BytesIO(detected_img_bytes))
            st.image(detected_img, caption="Detected Objects", use_container_width=True)

        # Show alarm if weapon detected
        if alarm:
            st.error("⚠️ ALERT: Weapon detected! Security threat identified! ⚠️")
            st.warning("Automatic alert has been sent to security personnel")

        # Display detected objects
        st.write("🔎 Detected Objects:")
        for obj in detected_objects:
            st.write(f"- {obj['label']} (Box: {obj['box']})")

        # Show sentiment if human detected
        if sentiment:
            st.write(f"🧠 **Human Emotional Analysis**: {sentiment}")
            
            # Display appropriate action based on emotion
            if sentiment in ["angry", "fear", "disgust"]:
                st.warning("⚠️ Subject shows negative emotions - additional screening recommended")
            elif sentiment in ["happy", "surprise"]:
                st.success("✅ Subject shows positive emotions")
            else:
                st.info("ℹ️ Subject shows neutral emotions")

    else:
        st.error("Detection failed! 🚨")
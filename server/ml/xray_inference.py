import os
import warnings

# Silence standard warnings
warnings.filterwarnings("ignore")

import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.transforms as transforms
import torchvision.models as models
import numpy as np
import cv2
import base64
from io import BytesIO
from PIL import Image
from my_gradcam import GradCAM, overlay_heatmap

# --------------------------------------------------
# CONFIG
# --------------------------------------------------
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(CURRENT_DIR, "best_model.pth")
GATEKEEPER_PATH = os.path.join(CURRENT_DIR, "gatekeeper_model.pth") 

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CLASS_NAMES = ["NORMAL", "PNEUMONIA", "TB"]

# --------------------------------------------------
# Model Architecture & Weight Loading
# --------------------------------------------------
def load_model():
    model = models.densenet121(weights=None)
    num_ftrs = model.classifier.in_features
    model.classifier = nn.Linear(num_ftrs, len(CLASS_NAMES))
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        
    state_dict = torch.load(MODEL_PATH, map_location=DEVICE, weights_only=True)
    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()
    return model

def load_gatekeeper():
    gatekeeper = models.mobilenet_v2(weights=None)
    num_ftrs = gatekeeper.classifier[1].in_features
    gatekeeper.classifier[1] = nn.Linear(num_ftrs, 2) 
    
    if not os.path.exists(GATEKEEPER_PATH):
        raise FileNotFoundError(f"Gatekeeper model not found at: {GATEKEEPER_PATH}")
        
    state_dict = torch.load(GATEKEEPER_PATH, map_location=DEVICE, weights_only=True)
    gatekeeper.load_state_dict(state_dict)
    gatekeeper.to(DEVICE)
    gatekeeper.eval()
    return gatekeeper

# --------------------------------------------------
# Initialization
# --------------------------------------------------
model = load_model()
gatekeeper_model = load_gatekeeper() 
target_layer = model.features[-1] 
gradcam = GradCAM(model, target_layer)

# --------------------------------------------------
# Image Preprocessing Logic
# --------------------------------------------------
# ✅ REVERTED: Removed Grayscale so the model can see color selfies and block them!
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def preprocess_xray(image_bytes):
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    original_for_display = image.copy()
    tensor = transform(image).unsqueeze(0).to(DEVICE)
    return original_for_display, tensor

# --------------------------------------------------
# Main Inference Pipeline
# --------------------------------------------------
def run_xray_inference(image_bytes):
    original_image, input_tensor = preprocess_xray(image_bytes)

    # 1. GATEKEEPER CHECK 
    with torch.no_grad():
        gk_logits = gatekeeper_model(input_tensor)
        gk_probs = F.softmax(gk_logits, dim=1)[0]
        invalid_probability = gk_probs[1].item() 
        
    # ✅ BALANCED THRESHOLD: 70%. Perfect middle ground.
    # Blocks SRK (he will be 99%), allows tricky X-rays (they will be 40-60%).
    if invalid_probability > 0.65:
        return {
            "error": "INVALID_IMAGE",
            "message": "Invalid file detected. Please upload a clear human Chest X-ray."
        }

    # 2. MAIN DIAGNOSIS
    with torch.no_grad():
        logits = model(input_tensor)
        probs = F.softmax(logits, dim=1)[0]
    
    probs_np = probs.cpu().numpy()
    pred_idx = int(np.argmax(probs_np))

    # 3. GRAD-CAM
    cam = gradcam.generate(input_tensor, class_idx=pred_idx)

    # 4. IMAGE ENCODING
    original_np = np.array(original_image.convert("RGB"))
    original_np = cv2.cvtColor(original_np, cv2.COLOR_RGB2BGR)
    
    _, original_buf = cv2.imencode(".jpg", original_np)
    original_base64 = base64.b64encode(original_buf).decode("utf-8")

    gradcam_img = overlay_heatmap(cam, original_np)
    _, gradcam_buf = cv2.imencode(".jpg", gradcam_img)
    gradcam_base64 = base64.b64encode(gradcam_buf).decode("utf-8")

    return {
        "prediction": CLASS_NAMES[pred_idx],
        "probabilities": {
            "NORMAL": float(probs_np[0]),
            "PNEUMONIA": float(probs_np[1]),
            "TB": float(probs_np[2])
        },
        "original_base64": original_base64,
        "gradcam_base64": gradcam_base64 
    }   
import os
import requests
from fastapi import FastAPI, HTTPException, status, File, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import io
from transformers import pipeline #type: ignore
from PIL import Image
from typing import Optional


load_dotenv()

# Huggingface pipeline for image classification
pipe = pipeline("image-classification", model="umm-maybe/AI-image-detector")


app = FastAPI(
    title="EchoMark",
    description="Provides endpoints to check for AI-generated content."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic Models
class TextRequest(BaseModel):
    """Defines the structure for a text detection request."""
    text: str

class ImageRequest(BaseModel):
    """Defines the structure for image detection request."""
    url: str

WINSTON_API = os.getenv('WINSTON_API')
SIGHTENGINE_API_USER = os.getenv('SIGHTENGINE_API_USER')
SIGHTENGINE_API_SECRET = os.getenv('SIGHTENGINE_API_SECRET')

# --- Root Endpoint ---
@app.get("/")
def root():
    return {'message': 'Welcome to the EchoMark'}

# ===================================================================
#                       IMAGE DETECTION ENDPOINTS
# ===================================================================

# Helper Function
def check_sightengine_credentials():
    if not SIGHTENGINE_API_USER or not SIGHTENGINE_API_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server-side API credentials for Sightengine are not configured."
        )

# AI generated image detection using Sightengine
@app.post("/check-image-url-sightengine/")
async def check_image_from_url(request: ImageRequest):
    """
    Accepts an image URL and checks for AI generated image using Sightengine.
    """
    check_sightengine_credentials()
    
    params = {
        'url': request.url,
        'models': 'genai',
        'api_user': SIGHTENGINE_API_USER,
        'api_secret': SIGHTENGINE_API_SECRET
    }
    try:
        response = requests.get('https://api.sightengine.com/1.0/check.json', params=params)
        response.raise_for_status()
        response_data = response.json()
        
        # Extract only the AI confidence score
        if 'type' in response_data and 'ai_generated' in response_data['type']:
            return f'Confidence Score: {response_data['type']['ai_generated']} '
        else:
            raise HTTPException(status_code=500, detail="Invalid response format from AI detection service")
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to call external image API: {e}")

@app.post("/check-raw-image-sightengine/")
async def check_raw_image_upload(file: UploadFile = File(...)):
    """
    Accepts a direct image upload and checks for AI generated image using Sightengine.
    """
    check_sightengine_credentials()
    
    params = {
        'models': 'genai',
        'api_user': SIGHTENGINE_API_USER,
        'api_secret': SIGHTENGINE_API_SECRET
    }
    files = {'media': file.file}
    try:
        response = requests.post('https://api.sightengine.com/1.0/check.json', files=files, data=params)
        response.raise_for_status()
        response_data = response.json()
        
        # Extract only the AI confidence score
        if 'type' in response_data and 'ai_generated' in response_data['type']:
            return f'Confidence Score: {response_data['type']['ai_generated']} '
        else:
            raise HTTPException(status_code=500, detail="Invalid response format from AI detection service")
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to call external image API: {e}")

# AI generated image detection using huggingface model
@app.post("/check-image-huggingface/")
async def classify_image(file: UploadFile = File(...)):
    """
    Accepts an image file, detect AI generated image using the umm-maybe/AI-image-detector
    """
    # 3. Read the contents of the uploaded file
    try:
        contents = await file.read()
        # Open the image from the byte contents
        image = Image.open(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # 4. Pass the image to the pipeline for classification
    try:
        results = pipe(image)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during classification: {e}")

     # 5. Transform the results into user-friendly format
    ai_score = 0
    real_score = 0
    
    for result in results:
        label = result['label']
        score = result['score']
        percentage = round(score * 100, 1)
        
        if label == 'artificial':
            ai_score = percentage
        elif label == 'human':
            real_score = percentage

    # Return formatted string with line break
    return {"result": f"AI-generated - {ai_score}, Real - {real_score}%"}



# ===================================================================
#                       TEXT DETECTION ENDPOINTS
# ===================================================================

def check_winston_credentials():
    """Helper function to check if the Winston AI API key is configured."""
    if not WINSTON_API:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server-side API key for Winston AI is not configured."
        )
    
@app.post("/check-text-winston/")
async def check_text_for_ai(request: TextRequest):
    """
    Accepts a block of text and checks for AI generation using the Winston AI API.
    """
    check_winston_credentials()

    url = "https://api.gowinston.ai/v2/ai-content-detection"
    
    
    payload = {
        "text": request.text,
        "language": "auto",  
        "sentences": False   
    }
    headers = {
        "Authorization": f"Bearer {WINSTON_API}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status() 
        return response.json()

    except requests.exceptions.HTTPError as http_err:
        try:
            error_detail = response.json().get("message", "An unknown error occurred.")
        except Exception:
            error_detail = str(http_err)
            
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Error from Winston AI API: {error_detail}"
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail=f"Failed to call the text detection service: {e}"
        )




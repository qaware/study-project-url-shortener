import base64
import io
import os
import random
import string
from typing import Dict, List, Optional
from urllib.parse import urlparse

import qrcode
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel


class ClickStatsData(BaseModel):
    count: int
    original_url: str

class UrlRequest(BaseModel):
  url: str
  # Frontend-provided hostname of this service
  service_host: str

class ClickStats(BaseModel):
  short_code: str
  original_url: str
  click_count: int

app = FastAPI()

# In-memory store for shortened URLs
url_store: Dict[str, str] = {}

# Holds information about clicks for each short URL
click_stats: Dict[str, ClickStatsData] = {}

def generate_short_code(length: int = 6) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.post("/shorten")
def shorten_url(request: UrlRequest, http_request: Request):
    # TODO: implement this function
    # 1. Generate short code for long url
    # 2. Store the mapping of short code to long url
    # 3. Optional: store click_stats using the class ClickStatsData for the short_code with initial values
    short_code = ""
    return {short_code}

@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
    # TODO: implement this function
    # 1. Fetch the long URL from the url_store using the short_code
    # 2. Return HTTP 404 (not found) if the short_code is not found
    # 3. (Optional) Update the click statistics in click_stats for the short_code
    long_url = ""
    return {long_url}

@app.get("/get-qr-code/{url}")
def get_qr_code(url: str):
    # TODO: implement this function
    # 1. Generate a QR code for the given url parameter
    # 2. Return the QR code image as a base64-encoded string
    # Hint: You can use the qrcode library to generate QR codes. 
    # Take a look at the documentation here: https://pypi.org/project/qrcode/
    encoded_string = ""
    # return {"image_base64": f"data:image/png;base64,{encoded_string}"}

# Click Statistics Endpoints
@app.get("/stats", response_model=List[ClickStats])
def get_all_stats():
  """Get click statistics for all shortened URLs."""
  stats = []
  for short_code, data in click_stats.items():
    
    stats.append(ClickStats(
      short_code=short_code,
      original_url=data.original_url,
      click_count=data.count
    ))
  return stats

@app.get("/stats/{short_code}")
def get_stats_for_url(short_code: str):
  """Get detailed statistics for a specific short URL."""
  if short_code not in url_store:
    raise HTTPException(status_code=404, detail="Short URL not found")
  
  if short_code not in click_stats:
    return {
      "short_code": short_code,
      "original_url": url_store[short_code],
      "click_count": 0,
    }
  
  data = click_stats[short_code]
  
  return {
    "short_code": short_code,
    "original_url": data.original_url,
    "click_count": data.count,
  }

@app.get("/example")
def example_endpoint(param: str):
    if param == "error":
        raise HTTPException(status_code=400, detail="Invalid parameter value")
    return {"message": f"This is an example endpoint with parameter: {param}"}

# Returns image in base64 format
@app.get("/example-image")
def example_image_endpoint():
    file_path = "image.jpeg"
    if os.path.exists(file_path):
        with open(file_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        prefix = "data:image/jpeg;base64,"
        return {"image_base64": prefix + encoded_string}
    else:
        raise HTTPException(status_code=404, detail="Image not found")

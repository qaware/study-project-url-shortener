import base64
import io
import os
import random
import string
from typing import Dict, List
from urllib.parse import unquote, urlparse

import qrcode
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


class ClickStatsData(BaseModel):
    count: int
    original_url: str

class UrlRequest(BaseModel):
  url: str

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

def is_self_referencing(url: str) -> bool:
  """Check if URL points to this URL shortener service to prevent infinite loops."""
  try:
    # Add protocol if missing
    if not url.startswith(('http://', 'https://')):
      url = 'http://' + url
    
    parsed = urlparse(url)
    
    # Known service domains (localhost with common ports)
    service_domains = {
      'localhost',
      'localhost:80', 
      'localhost:8000',
      'localhost:8080'
    }
    
    return parsed.netloc.lower() in service_domains
  except Exception:
    # If URL parsing fails, allow it (conservative approach)
    return False

@app.post("/shorten")
def shorten_url(request: UrlRequest):
  # Check for self-referencing URLs to prevent infinite redirect loops
  if is_self_referencing(request.url):
    raise HTTPException(
      status_code=400, 
      detail="Cannot shorten URLs that point to this service - this would create an infinite redirect loop. Please use an external URL instead."
    )

  if request.url in url_store.values():
    raise HTTPException(status_code=400, detail="URL was already shortened previously")

  short_code = generate_short_code()
  while short_code in url_store:
    short_code = generate_short_code()

  url_store[short_code] = request.url
  
  # Initialize click stats for the new URL
  click_stats[short_code] = ClickStatsData(
    count=0,
    original_url=request.url
  )
  
  return {short_code}

@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
  if short_code in url_store:
    # Track clicks
    if short_code not in click_stats:
      click_stats[short_code] = ClickStatsData(
        count=0,
        original_url=url_store[short_code]
      )
    
    click_stats[short_code].count += 1
    return {url_store[short_code]}

  raise HTTPException(status_code=404, detail="Short URL not found")


@app.get("/get-qr-code/{url}")
def get_qr_code(url: str):
  # URL decode the parameter to handle special characters
  decoded_url = url
  
  qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=0,
  )
  qr.add_data(decoded_url)
  qr.make(fit=True)
  img = qr.make_image(fill_color="black", back_color="white")
  buf = io.BytesIO()
  img.save(buf, format="PNG")
  buf.seek(0)
  encoded_string = base64.b64encode(buf.read()).decode("utf-8")
  return {"image_base64": f"data:image/png;base64,{encoded_string}"}

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

# Returns simple string message
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

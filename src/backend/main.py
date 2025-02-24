from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import io
import base64
import qrcode
import random
import string

app = FastAPI()

# In-memory store for shortened URLs
url_store = {}

class UrlRequest(BaseModel):
  url: str

def generate_short_code(length: int = 6) -> str:
  return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.post("/shorten")
def shorten_url(request: UrlRequest):

  if request.url in url_store.values():
    raise HTTPException(status_code=400, detail="URL was already shortened previously")

  short_code = generate_short_code()
  while short_code in url_store:
    short_code = generate_short_code()

  url_store[short_code] = request.url
  return {short_code}

@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
  if short_code in url_store:
    return {url_store[short_code]}

  raise HTTPException(status_code=404, detail="Short URL not found")


@app.get("/get-qr-code/{url}")
def get_qr_code(url: str):
  qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=0,
  )
  qr.add_data(url)
  qr.make(fit=True)
  img = qr.make_image(fill_color="black", back_color="white")
  buf = io.BytesIO()
  img.save(buf, format="PNG")
  buf.seek(0)
  encoded_string = base64.b64encode(buf.read()).decode("utf-8")
  return {"image_base64": f"data:image/png;base64,{encoded_string}"}

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

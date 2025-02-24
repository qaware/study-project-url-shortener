from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import io
import base64
import qrcode
import random
import string

app = FastAPI()

# TODO: implement some kind of storage for the URLs and their associated short codes

class UrlRequest(BaseModel):
    url: str

def generate_short_code(length: int = 6) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.post("/shorten")
def shorten_url(request: UrlRequest):
    # TODO: implement this function
    # Should store url which is contained in request, generate a (random?) associated short code and return that short code
    short_code = ""
    return {short_code}

@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
    # TODO: implement this function
    # Should take the short_code to fetch the associated long URL 
    # Should return HTTP 404 (not found) if the short_code is not found
    long_url = ""
    return {long_url}

@app.get("/get-qr-code/{url}")
def get_qr_code(url: str):
    # TODO: implement this function
    # Hint: You can use the qrcode library to generate QR codes. 
    # Take a look at the documentation here: https://pypi.org/project/qrcode/
    encoded_string = ""
    # return {"image_base64": f"data:image/png;base64,{encoded_string}"}
    return

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
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import io
import base64
import qrcode
import random
import string

app = FastAPI()

short_idx = -1
short_to_long = {}
SYMBOL_LIST = string.ascii_letters + string.digits
# TODO: implement some kind of storage for the URLs and their associated short codes

class UrlRequest(BaseModel):
    url: str


def encode_base62(num: int) -> str:   
    characters = string.digits + string.ascii_letters  # 62 characters
    base = len(characters)
    encoded = []
    
    if num == 0:
        return characters[0]
    
    while num > 0:
        num, remainder = divmod(num, base)
        encoded.append(characters[remainder])
    
    return ''.join(reversed(encoded))


def generate_short_code(length: int = 6) -> str:
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.post("/shorten")
def shorten_url(request: UrlRequest):
    # TODO: implement this function
    # Should store url which is contained in request, generate a (random?) associated short code and return that short code
    global short_idx
    short_idx += 1
    short_code = encode_base62(short_idx)
    short_to_long[short_code] = request.url
    return {short_code}

@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
    long_url = short_to_long.get(short_code, -1)
    if long_url == -1:
        raise HTTPException(status_code=404, detail="Short code not found")
    return {long_url}

@app.get("/get-qr-code/{url}")
def get_qr_code(url: str):
    # TODO: implement this function
    # Hint: You can use the qrcode library to generate QR codes. 
    # Take a look at the documentation here: https://pypi.org/project/qrcode/
    img = qrcode.make(url)
    # encode img to base64
    # img.save("some_file.png")
    byteIO = io.BytesIO()
    img.save(byteIO, format='PNG')
    byteArr = byteIO.getvalue()
    encoded_string = base64.b64encode(byteArr).decode('utf-8')

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
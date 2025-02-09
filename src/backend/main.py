from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
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

@app.get("/{short_code}")
def get_long_url(short_code: str):
    if short_code in url_store:
        return {url_store[short_code]}
    
    raise HTTPException(status_code=404, detail="Short URL not found")

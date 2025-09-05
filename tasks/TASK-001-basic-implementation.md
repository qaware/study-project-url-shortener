# TODO: read the file and make sure everything is fine
# TASK-001: Basic URL Shortener Implementation

**As a** user visiting the URL shortener website  
**I want** to enter a long URL and receive a shortened version  
**So that** I can share links more easily and track click statistics

---

## Context

This is the core functionality of the URL shortener application. Currently, the backend endpoints in `src/backend/main.py` are incomplete - they contain TODO comments and return empty responses. The frontend is already built and expects these endpoints to work correctly.

Your task is to implement the missing logic in the Python FastAPI backend to make the URL shortener functional. The application uses in-memory storage (Python dictionaries) to keep things simple for this learning exercise.

---

## What You Need to Implement

You need to complete **2 required endpoints** and **1 optional endpoint** in `src/backend/main.py`:

### Required Endpoints:

1. **`shorten_url`** - Convert long URLs to short codes
2. **`get_long_url`** - Retrieve original URLs from short codes

### Optional Endpoint:

3. **`get_qr_code`** - Generate QR codes for URLs

---

## Requirements

### Functional Requirements

- Short codes should be **6 characters long** (use existing `generate_short_code` function)
- Store URL mappings in the existing `url_store` dictionary
- Handle click statistics in the `click_stats` dictionary
- Return proper HTTP status codes (200 for success, 404 for not found)
- Support any valid URL format

### Technical Requirements

- Use existing data structures: `url_store` and `click_stats`
- Follow existing code patterns and imports
- Return JSON responses matching the expected format
- Handle errors gracefully with appropriate HTTP status codes

---

## Documentation Links

### FastAPI Basics

- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [FastAPI Response Models](https://fastapi.tiangolo.com/tutorial/response-model/)
- [HTTP Status Codes](https://fastapi.tiangolo.com/tutorial/response-status-code/)

### Python Dictionary Operations

- [Python Dictionaries](https://docs.python.org/3/tutorial/datastructures.html#dictionaries)
- [Dictionary Methods](https://docs.python.org/3/library/stdtypes.html#dict)

### QR Code Generation (Optional)

- [qrcode Library Documentation](https://pypi.org/project/qrcode/)
- [Base64 Encoding in Python](https://docs.python.org/3/library/base64.html)

### Testing Your Implementation

- Use the existing Taskfile commands to test your endpoints
- Check `Requests.yml` for example API calls

---

## Acceptance Criteria

### ✅ Shorten URL Endpoint (`/shorten`)

**Input:** JSON with `url` field  
**Expected Behavior:**

- [ ] Generate a 6-character short code using `generate_short_code()`
- [ ] Store mapping: `url_store[short_code] = original_url`
- [ ] Initialize click stats: `click_stats[short_code] = ClickStatsData(count=0, original_url=original_url)`
- [ ] Return JSON with the short code: `{"short_code": "abc123"}`

**Test Cases:**

- [ ] `{"url": "https://www.google.com"}` → returns short code
- [ ] `{"url": "https://very-long-url.example.com/with/many/paths?param=value"}` → returns short code
- [ ] Each call generates a unique short code

### ✅ Get Long URL Endpoint (`/get-long-url/{short_code}`)

**Input:** Short code in URL path  
**Expected Behavior:**

- [ ] Look up `short_code` in `url_store`
- [ ] If found: increment click count in `click_stats` and return original URL
- [ ] If not found: return HTTP 404 with error message
- [ ] Return JSON: `{"original_url": "https://www.google.com"}`

**Test Cases:**

- [ ] Valid short code → returns original URL and increments click count
- [ ] Invalid short code → returns 404 error
- [ ] Multiple requests to same short code → click count increases

### ✅ QR Code Endpoint (`/get-qr-code/{url}`) - Optional

**Input:** URL in path parameter  
**Expected Behavior:**

- [ ] Generate QR code image for the given URL
- [ ] Convert image to base64 string
- [ ] Return JSON: `{"image_base64": "data:image/png;base64,..."}`

**Test Cases:**

- [ ] Valid URL → returns base64 QR code image
- [ ] QR code can be displayed in browser when used as image source

---

## Implementation Hints

### For `shorten_url`:

```python
@app.post("/shorten")
def shorten_url(request: UrlRequest):
    # 1. Generate short code
    short_code = generate_short_code()
    
    # 2. Store in url_store
    url_store[short_code] = request.url
    
    # 3. Initialize click stats
    click_stats[short_code] = ClickStatsData(count=0, original_url=request.url)
    
    # 4. Return short code
    return {"short_code": short_code}
```

### For `get_long_url`:

```python
@app.get("/get-long-url/{short_code}")
def get_long_url(short_code: str):
    # 1. Check if short_code exists
    if short_code not in url_store:
        raise HTTPException(status_code=404, detail="Short URL not found")
    
    # 2. Get original URL
    original_url = url_store[short_code]
    
    # 3. Update click stats
    if short_code in click_stats:
        click_stats[short_code].count += 1
    
    # 4. Return original URL
    return {"original_url": original_url}
```

---

## Testing Your Implementation

### Using Taskfile Commands:

1. Start the backend: `task run-backend-dev`
2. Test URL shortening: `task execute-shorten-local`
3. Test URL retrieval: `task execute-get-long-url-local`

### Manual Testing:

1. Open `http://localhost:8000/docs` to see the API documentation
2. Test endpoints directly in the FastAPI interactive docs
3. Start the frontend with `task run-frontend-dev` and test the full application

### Check Existing Examples:

- Look at the `/stats` endpoints (lines 66-98) to see working examples
- Study the `/example` endpoint (lines 100-104) for error handling patterns

---

## Success Criteria

**You're done when:**

- [ ] Frontend application works end-to-end (shorten URLs and redirect)
- [ ] All Taskfile test commands pass
- [ ] Statistics endpoints show correct click counts
- [ ] No Python errors in the backend console
- [ ] QR code endpoint works (if implemented)

---

**Next Steps:** Once you complete this basic implementation, ask your instructor about advanced tasks like URL validation, custom domains, or database integration.

---

*Estimated Completion Time: 1-2 hours*  
*Prerequisites: Basic Python knowledge, understanding of dictionaries and functions*

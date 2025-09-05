# TODO: this feature is to be implemented on "solution"
# US-002: URL Self-Reference Loop Prevention

**As a** user of the URL shortener  
**I want** the system to prevent me from creating infinite redirect loops  
**So that** I don't accidentally create shortened URLs that lead to continuous forwarding

---

## Context

Currently, the URL shortener doesn't validate whether the URL being shortened points back to the same service. This can create dangerous infinite redirect loops:

1. **Infinite Redirects**: User shortens `http://localhost:80/abc123` → creates `http://localhost:80/xyz789` → endless loop
2. **Browser Crashes**: Modern browsers will eventually stop following redirects, but this creates poor user experience
3. **Server Load**: Infinite loops can cause unnecessary server load and resource consumption
4. **Security Risk**: Could be exploited for denial-of-service attacks

This validation is a common feature in professional URL shorteners like bit.ly and tinyurl, which reject self-referencing URLs to maintain system stability and user experience.

---

## Requirements

### Functional Requirements

- Detect when a URL being shortened points to the same URL shortener service
- Return appropriate error response instead of creating the shortened URL
- Support both `localhost` and production domain detection
- Maintain existing functionality for valid URLs

### Technical Requirements

- Backend validation in the `shorten_url` endpoint
- Proper HTTP error codes (400 Bad Request)
- Frontend error handling and display
- Case-insensitive domain matching

### User Experience Requirements

- Clear error message explaining why the URL was rejected
- Red error display area in the frontend
- Error message disappears when user enters a new valid URL
- No shortened URL should be displayed on error

---

## Documentation Links

### URL Parsing & Validation

- [Python urllib.parse Documentation](https://docs.python.org/3/library/urllib.parse.html)

### FastAPI Error Handling

- [FastAPI Exception Handling](https://fastapi.tiangolo.com/tutorial/handling-errors/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

### Frontend Error Handling

- [Angular HTTP Error Handling](https://angular.io/guide/http#error-handling)

---

## Acceptance Criteria

### ✅ Backend Validation

- [ ] Extract domain from incoming URL using `urllib.parse`
- [ ] Compare against current service domains (`localhost`, `localhost:80`, `localhost:8080`)
- [ ] Return HTTP 400 with error message: `"Cannot shorten URLs that point to this service - this would create an infinite redirect loop"`
- [ ] Handle URLs with/without protocols (`http://`, `https://`)
- [ ] Case-insensitive domain matching (localhost == LOCALHOST)

### ✅ Error Response Format

- [ ] HTTP status code 400 (Bad Request)
- [ ] Error message explains the self-reference issue clearly
- [ ] Include suggestion: "Please use an external URL instead"

### ✅ Frontend Error Display

- [ ] Catch HTTP 400 responses from the shorten endpoint
- [ ] Display red error box instead of success message
- [ ] Error message matches backend response
- [ ] Error disappears when user types in input field again
- [ ] No shortened URL component is shown during error state

### ✅ Valid URL Handling

- [ ] External URLs (google.com, youtube.com, etc.) work normally
- [ ] IP addresses work normally (192.168.1.1, 8.8.8.8)
- [ ] Different ports work normally (localhost:3000, localhost:9000)
- [ ] HTTPS external URLs work normally

---

## Technical Implementation Guide

### Backend Changes (main.py)

```python
from urllib.parse import urlparse

def is_self_referencing(url: str) -> bool:
    """Check if URL points to this service"""
    try:
        parsed = urlparse(url)
        # Add protocol if missing
        if not parsed.scheme:
            url = "http://" + url
            parsed = urlparse(url)
        
        # Check against known service domains
        service_domains = ["localhost", "localhost:80", "localhost:8080"]
        return parsed.netloc.lower() in service_domains
    except:
        return False

@app.post("/shorten")
def shorten_url(request: UrlRequest):
    if is_self_referencing(request.url):
        raise HTTPException(
            status_code=400, 
            detail={
                "error": "Self-reference not allowed",
                "message": "Cannot shorten URLs that point to this service - this would create an infinite redirect loop. Please use an external URL instead."
            }
        )
    # ... existing implementation
```

### Frontend Changes

- Update HTTP error handling in the service
- Create red error display component
- Clear error state on input change
- Hide success message during error state

---

## Test Cases

### ✅ Self-Referencing URLs (Should Fail)

- [ ] `http://localhost:80/abc123`
- [ ] `https://localhost:80/xyz789`
- [ ] `localhost/test`
- [ ] `LOCALHOST:80/TEST` (case insensitive)

### ✅ Valid URLs (Should Work)

- [ ] `https://www.google.com`
- [ ] `https://youtube.com/watch?v=123`
- [ ] `http://192.168.1.1:3000`
- [ ] `https://localhost:3000` (different port)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Backend validation implemented and tested
- [ ] Frontend error handling working
- [ ] Manual testing with various URL patterns
- [ ] Code review completed
- [ ] No regression in existing functionality

---

**Related Issues:** None  
**Blocked By:** None  
**Blocks:** None

---

*Last Updated: 2025-09-05*  
*Created By: Teaching Assistant*

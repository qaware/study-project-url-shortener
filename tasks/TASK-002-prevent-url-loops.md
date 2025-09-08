# US-002: Prevent Self-Referencing URL Loops

**As a** user of the URL shortener  
**I want** the system to prevent me from creating infinite redirect loops  
**So that** I don't accidentally create shortened URLs that lead to continuous forwarding

---

## Context

Currently, the URL shortener doesn't validate whether the URL being shortened points back to the same service domain. This can create infinite redirect loops:

1. **Infinite Redirects**: User shortens `http://localhost:8080/abc123` → creates `http://localhost:8080/xyz789` → endless loop
2. **Browser Crashes**: Modern browsers will eventually stop following redirects, but this creates poor user experience
3. **Server Load**: Infinite loops can cause unnecessary server load and resource consumption
4. **Security Risk**: Could be exploited for denial-of-service attacks

This validation is a common feature in professional URL shorteners like bit.ly and tinyurl, which reject self-referencing URLs to maintain system stability and user experience.

---

## Requirements

### Functional Requirements

- Detect when a URL being shortened has the same hostname as the service
- Treat ports as irrelevant (only hostname matters)
- Return appropriate error response instead of creating the shortened URL
- Maintain existing functionality for valid external URLs

### Technical Requirements

- Frontend already sends the service hostname (`window.location.hostname`) with shorten requests
- Backend validation in the `shorten_url` endpoint
- Ignore port when evaluating the target (use hostname only)
- Proper HTTP error code (400 Bad Request)
- Frontend error handling and display
- Case-insensitive hostname comparison

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

- [ ] Extract domain (hostname) from incoming URL using `urllib.parse`
- [ ] Evaluate hostname only; ignore port
- [ ] Reject when target hostname equals provided service hostname
- [ ] Return HTTP 400 with error message: `"Cannot shorten URLs that point to this service - this would create an infinite redirect loop"`
- [ ] Handle URLs with/without protocols (`http://`, `https://`)
- [ ] Case-insensitive matching

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
- [ ] HTTPS external URLs work normally

---

## Technical Implementation Guide

## Test Cases

### ✅ Self-Referencing URLs (Should Fail)

- [ ] `http://<service-hostname>:8080/abc123` (matching hostname different port)
- [ ] `https://<service-hostname>/xyz789`
- [ ] `<service-hostname>/path`

### ✅ Valid URLs (Should Work)

- [ ] `https://www.google.com`
- [ ] `https://youtube.com/watch?v=123`
- [ ] `http://some-other-host:3000`

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Backend validation implemented and tested
- [ ] Frontend error handling working
- [ ] Manual testing with various URL patterns

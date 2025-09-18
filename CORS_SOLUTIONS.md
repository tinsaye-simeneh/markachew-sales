# Complete CORS Solutions Guide

## 🚨 CORS Error Still Persisting?

If you're still getting CORS errors after implementing the proxy routes, here are multiple solutions to try:

## Solution 1: Test API Connection (Recommended First Step)

1. **Visit the test page**: Go to `http://localhost:3000/test-api`
2. **Run the tests** to see which method works
3. **Check the results** to identify the working approach

## Solution 2: Install CORS Browser Extension (Quick Fix)

### For Chrome/Edge:
1. **Open Chrome Extensions**: Go to `chrome://extensions/`
2. **Enable Developer Mode**: Toggle the switch in the top right
3. **Load Unpacked Extension**: Click "Load unpacked" and select the `public/cors-extension` folder
4. **Enable the Extension**: Click the extension icon and enable CORS disabling
5. **Refresh your app** and try registration again

### For Firefox:
1. **Install CORS Unblock Extension** from Firefox Add-ons
2. **Enable the extension** and refresh your app

## Solution 3: Use CORS Proxy Services

The app now automatically tries multiple CORS proxy services as fallbacks:
- `cors-anywhere.herokuapp.com`
- `api.allorigins.win`
- `thingproxy.freeboard.io`

## Solution 4: Browser-Specific Solutions

### Chrome with Flags:
```bash
# Start Chrome with disabled security
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security --disable-features=VizDisplayCompositor
```

### Firefox with Config:
1. Type `about:config` in Firefox address bar
2. Search for `security.fileuri.strict_origin_policy`
3. Set it to `false`
4. Restart Firefox

## Solution 5: Development Server Configuration

### Option A: Use Different Port
```bash
# Try running on a different port
npm run dev -- --port 3001
```

### Option B: Use HTTPS
```bash
# Install mkcert for local HTTPS
npm install -g mkcert
mkcert -install
mkcert localhost 127.0.0.1 ::1
```

## Solution 6: API Server Configuration (Contact API Provider)

Ask the API provider to add these headers to their server:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: false
```

## Solution 7: Alternative API Endpoints

Try these alternative endpoints if available:
- `https://employee.luckbingogames.com/api/v1/users/register`
- `https://api.employee.luckbingogames.com/users/register`

## Solution 8: Network-Level Solutions

### Use a VPN:
Sometimes CORS issues are network-related. Try using a VPN.

### Check Firewall/Antivirus:
Some security software blocks cross-origin requests.

## Solution 9: Code-Level Workarounds

### Use JSONP (if supported):
```javascript
// Only works if the API supports JSONP
const script = document.createElement('script');
script.src = 'https://employee.luckbingogames.com/api/users/register?callback=handleResponse';
document.head.appendChild(script);
```

### Use Server-Side Proxy:
Create a simple Node.js server to proxy requests:

```javascript
// proxy-server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/api', createProxyMiddleware({
  target: 'https://employee.luckbingogames.com',
  changeOrigin: true,
}));

app.listen(8080);
```

## Solution 10: Environment Variables

Create a `.env.local` file with:

```env
# Try different API URLs
NEXT_PUBLIC_API_BASE_URL=https://employee.luckbingogames.com
# or
NEXT_PUBLIC_API_BASE_URL=https://api.employee.luckbingogames.com
# or
NEXT_PUBLIC_API_BASE_URL=https://cors-anywhere.herokuapp.com/https://employee.luckbingogames.com
```

## Debugging Steps

### 1. Check Browser Console:
```javascript
// Open DevTools (F12) and run:
fetch('https://employee.luckbingogames.com/api/users/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' })
}).then(r => console.log('Success:', r)).catch(e => console.log('Error:', e));
```

### 2. Check Network Tab:
- Look for the actual request URL
- Check response headers
- Look for CORS-related error messages

### 3. Test with curl:
```bash
curl -X POST https://employee.luckbingogames.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test","email":"test@example.com","phone":"0912345678","user_type":"BUYER","password":"password123"}'
```

### 4. Test with Postman:
- Verify the API works in Postman
- Check if the API requires specific headers
- Look for any authentication requirements

## Quick Fixes to Try Right Now

### Fix 1: Clear Browser Cache
```bash
# Clear all browser data
# Or use incognito/private mode
```

### Fix 2: Try Different Browser
- Chrome
- Firefox
- Safari
- Edge

### Fix 3: Disable Browser Extensions
- Disable all extensions temporarily
- Test in incognito mode

### Fix 4: Check Local Network
```bash
# Test if the API is accessible
ping employee.luckbingogames.com
nslookup employee.luckbingogames.com
```

## Emergency Workaround

If nothing else works, you can temporarily use a mock registration:

```typescript
// In src/lib/api/auth.ts, temporarily replace the register method:
async register(userData: RegisterRequest): Promise<AuthResponse> {
  // Temporary mock for development
  const mockUser = {
    id: Date.now().toString(),
    full_name: userData.full_name,
    email: userData.email,
    phone: userData.phone,
    user_type: userData.user_type,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const mockResponse = {
    accessToken: 'mock-token-' + Date.now(),
    refreshToken: 'mock-refresh-' + Date.now(),
    user: mockUser,
  };
  
  // Store mock tokens
  apiClient.setAuthToken(mockResponse.accessToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', mockResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(mockResponse.user));
  }
  
  return mockResponse;
}
```

## Still Having Issues?

1. **Check the test page**: `http://localhost:3000/test-api`
2. **Try the browser extension**: Load the CORS extension from `public/cors-extension`
3. **Use a different browser**: Try Firefox or Safari
4. **Contact the API provider**: Ask them to configure CORS properly
5. **Use a VPN**: Sometimes network-level issues cause CORS problems

## Success Indicators

You'll know it's working when:
- ✅ No CORS errors in browser console
- ✅ Registration requests return 200/201 status
- ✅ User data is stored in localStorage
- ✅ User is redirected to profile page
- ✅ Login works with the registered credentials

The most reliable solution is usually the browser extension for development, or asking the API provider to configure CORS properly for production.
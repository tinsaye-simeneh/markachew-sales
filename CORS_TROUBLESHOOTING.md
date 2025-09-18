# CORS Error Troubleshooting Guide

## Problem
You're experiencing CORS (Cross-Origin Resource Sharing) errors when trying to register users in your application, even though the API works fine in Postman.

## Why This Happens
- **Browsers enforce CORS policies** for security reasons
- **Postman doesn't enforce CORS** - it's a testing tool, not a browser
- The API server at `https://employee.luckbingogames.com` needs to explicitly allow requests from your domain

## Solutions Implemented

### 1. Next.js API Proxy Routes ✅
Created proxy routes in your Next.js application:
- `/api/auth/register` → proxies to `https://employee.luckbingogames.com/api/users/register`
- `/api/auth/login` → proxies to `https://employee.luckbingogames.com/api/users/login`
- `/api/jobs` → proxies to `https://employee.luckbingogames.com/api/jobs`
- `/api/houses` → proxies to `https://employee.luckbingogames.com/api/houses`

### 2. Environment-Based Configuration ✅
- **Development**: Uses Next.js proxy routes (no CORS issues)
- **Production**: Uses direct API calls (if CORS is properly configured on server)

### 3. CORS Error Handling ✅
- Detects CORS errors automatically
- Provides user-friendly error messages
- Falls back to proxy routes when needed

### 4. Next.js Configuration ✅
Updated `next.config.ts` with:
- CORS headers for API routes
- Proxy rewrites for development

## How to Test the Fix

### Step 1: Restart Your Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### Step 2: Test Registration
1. Open your application in the browser
2. Try to register a new user
3. Check the browser's Network tab to see if requests are going to `/api/auth/register` instead of the external API

### Step 3: Check Console for Errors
- Open browser DevTools (F12)
- Look for any CORS-related errors in the Console
- Check the Network tab to see the actual requests being made

## Alternative Solutions (If Proxy Routes Don't Work)

### Option A: Contact API Provider
Ask the API provider to add CORS headers:
```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Option B: Use a CORS Proxy Service
For development only, you can use a public CORS proxy:
```typescript
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const API_URL = `${PROXY_URL}https://employee.luckbingogames.com`;
```

### Option C: Browser Extension (Development Only)
Install a CORS browser extension like "CORS Unblock" for development.

## Debugging Steps

### 1. Check Network Requests
```bash
# Open browser DevTools → Network tab
# Look for:
# - Request URL (should be /api/auth/register in development)
# - Response headers (should include CORS headers)
# - Status code (should be 200 for successful requests)
```

### 2. Check Console Errors
```javascript
// Look for errors like:
// "Access to fetch at 'https://employee.luckbingogames.com/api/users/register' 
//  from origin 'http://localhost:3000' has been blocked by CORS policy"
```

### 3. Test API Endpoints Directly
```bash
# Test the proxy route directly
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Test User","email":"test@example.com","phone":"0912345678","user_type":"BUYER","password":"password123"}'
```

### 4. Check Environment Variables
```bash
# Make sure you have the correct environment setup
echo $NODE_ENV  # Should be 'development' in dev mode
```

## Production Considerations

### For Production Deployment:
1. **Remove proxy routes** or configure them properly
2. **Ensure the API server has CORS configured** for your production domain
3. **Use environment variables** to switch between development and production API URLs

### Environment Configuration:
```env
# .env.local (development)
NEXT_PUBLIC_API_BASE_URL=https://employee.luckbingogames.com

# .env.production (production)
NEXT_PUBLIC_API_BASE_URL=https://employee.luckbingogames.com
```

## Common Issues and Solutions

### Issue 1: "Network Error" or "Failed to fetch"
**Solution**: Check if the API server is running and accessible

### Issue 2: "CORS policy" errors
**Solution**: Use the proxy routes (already implemented)

### Issue 3: "404 Not Found" on proxy routes
**Solution**: Make sure the API route files are in the correct location:
```
src/app/api/auth/register/route.ts
src/app/api/auth/login/route.ts
```

### Issue 4: "500 Internal Server Error" on proxy routes
**Solution**: Check the server logs and ensure the external API is accessible

## Testing Checklist

- [ ] Development server is running
- [ ] No CORS errors in browser console
- [ ] Registration requests go to `/api/auth/register`
- [ ] Login requests go to `/api/auth/login`
- [ ] API responses are successful (200 status)
- [ ] User data is stored in localStorage after successful registration
- [ ] User is redirected to profile page after registration

## Need Help?

If you're still experiencing issues:

1. **Check the browser console** for specific error messages
2. **Verify the API server is running** by testing in Postman
3. **Check the Network tab** to see the actual requests being made
4. **Try the direct API URL** in Postman to ensure it's working
5. **Contact the API provider** if CORS headers are missing

The proxy route solution should resolve your CORS issues in development. For production, you'll need to ensure the API server has proper CORS configuration.
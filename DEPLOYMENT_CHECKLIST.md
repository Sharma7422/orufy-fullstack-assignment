# Deployment Checklist - OTP Verification Fix

## 🔍 Frontend (.env)

Check that `client/.env` contains:

```
VITE_API_URL=https://your-backend-url.com
```

Replace `https://your-backend-url.com` with your actual deployed backend URL.

## ✅ Backend Configuration

### 1. Environment Variables

Ensure `server/.env` has:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8301 (or your port)
```

### 2. CORS Configuration

Backend now has:

- ✅ CORS enabled for all origins
- ✅ Preflight OPTIONS requests handled
- ✅ Credentials support enabled

### 3. API Endpoints Verification

Test these endpoints in Postman/Insomnia:

**Send OTP:**

```
POST https://your-backend-url/api/auth/send-otp
Body: { "email": "test@example.com" }
```

**Verify OTP:**

```
POST https://your-backend-url/api/auth/verify-otp
Body: { "email": "test@example.com", "otp": "123456" }
```

## 🐛 Debugging Steps

### If OTP verification fails:

1. **Check Browser Console:**

   - Open DevTools (F12)
   - Go to Console tab
   - Look for logs starting with "Verifying OTP for:"
   - Check for any red error messages

2. **Check Network Tab:**

   - Open DevTools (F12)
   - Go to Network tab
   - Try the OTP verification
   - Look for the request to `/api/auth/verify-otp`
   - Check response status (should be 200)

3. **Check Backend Console:**

   - Look for request logs
   - Check if MongoDB is connected
   - Verify JWT_SECRET is set

4. **Common Issues:**

   | Issue                     | Solution                                                 |
   | ------------------------- | -------------------------------------------------------- |
   | "Session expired" message | Make sure you went through login first to set authValue  |
   | No network request sent   | Check if VITE_API_URL is correct in .env                 |
   | 404 error                 | Verify backend endpoint exists at `/api/auth/verify-otp` |
   | 500 error                 | Check backend console for MongoDB or JWT errors          |
   | CORS error                | Backend now has CORS enabled - should be fixed           |

## 🚀 Deployment on Render/Vercel

### Backend (Render)

1. Push code to GitHub
2. Connect Render to your repo
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT=8301`
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Connect Vercel to your repo
3. Set environment variable:
   - `VITE_API_URL=https://your-backend-url.render.com` (or your backend URL)
4. Deploy

## 📝 Recent Updates

- ✅ Added authValue validation
- ✅ Added detailed console logging
- ✅ Improved error messages
- ✅ Enhanced CORS configuration
- ✅ Added error interceptor for debugging

## 🔗 Frontend URL vs Backend URL

**Make sure:**

- Frontend can access Backend URL (no firewall blocking)
- Backend CORS allows Frontend URL
- Both are HTTPS on production

## ✨ Test Flow

1. Go to Login page
2. Enter email or phone
3. Click "Login" or "SignUp Here"
4. Should see OTP auto-filled (demo mode)
5. Click "Verify OTP"
6. Should navigate to Dashboard
7. Check browser console for logs (should show "OTP verified successfully")

If you see errors in console, share them here for quick fix!

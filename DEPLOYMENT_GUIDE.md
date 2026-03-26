# Deployment Guide

## Overview
This guide will help you deploy your frontend and backend online with proper CORS configuration.

## Frontend Configuration ✅
The frontend has been configured with dynamic API URLs that automatically work in both development and production:

- **Development**: Uses `http://localhost:5000` for API calls
- **Production**: Uses relative URLs (same domain as deployment)

### Files Updated:
- `config.js` - New configuration file for environment detection
- All HTML files - Include `config.js` before other scripts
- All JavaScript files - Use `getApiUrl()` and `getSocketUrl()` functions

## Backend Configuration ✅
The backend CORS has been updated to be more flexible:

- **Development**: Allows localhost origins
- **Production**: Allows any origin (can be restricted as needed)

## Deployment Options

### Option 1: Same Domain Deployment (Recommended)
Deploy both frontend and backend to the same domain with different paths:

- Frontend: `https://yourdomain.com/`
- Backend: `https://yourdomain.com/api/`

### Option 2: Subdomain Deployment
- Frontend: `https://yourdomain.com/`
- Backend: `https://api.yourdomain.com/`

### Option 3: Different Domains
- Frontend: `https://yourdomain.com/`
- Backend: `https://your-backend-domain.com/`

## Environment Variables

Set these in your backend deployment:

```bash
NODE_ENV=production
PORT=5000
# Add your other environment variables
```

## Testing Before Deployment

1. **Local Test**: Run both frontend and backend locally
2. **Production Test**: Deploy and test all API endpoints
3. **CORS Test**: Check browser network tab for CORS errors

## Common Deployment Platforms

### Frontend:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

### Backend:
- Heroku
- Render
- AWS EC2
- DigitalOcean

## Troubleshooting

### CORS Errors
If you get CORS errors:
1. Check backend CORS configuration
2. Verify frontend is using correct URLs
3. Check browser network tab for error details

### API Connection Issues
If API calls fail:
1. Verify backend is running and accessible
2. Check environment variables
3. Test API endpoints directly

### Socket.IO Issues
If real-time features don't work:
1. Verify Socket.IO URL configuration
2. Check WebSocket connections in browser dev tools
3. Ensure backend allows WebSocket connections

## Success Indicators
✅ No CORS errors in browser console
✅ All API endpoints respond correctly
✅ Real-time features work (Socket.IO)
✅ Authentication functions properly
✅ File uploads work correctly

## Next Steps
1. Choose your deployment platform
2. Configure environment variables
3. Deploy backend first
4. Update frontend config if needed
5. Deploy frontend
6. Test all functionality

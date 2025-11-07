# ⚡ Quick Deploy Reference - Healthcare Booking System

## 🚀 One-Command Deployment

### Windows
```cmd
deploy-production.bat
```

### Linux/Mac
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

---

## 📦 Manual Deployment Commands

### Frontend (Vercel)
```bash
# Install CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

### Frontend (Netlify)
```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod
```

### Backend (Railway)
```bash
# Use Railway Dashboard
# https://railway.app
# Or install CLI:
npm install -g @railway/cli
railway login
railway up
```

---

## 🔧 Quick Setup Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Backend Locally
```bash
cd backend
npm install
npm start
# Visit: http://localhost:5000/api/health
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
# Visit: http://localhost:3000
```

### Build Frontend
```bash
cd frontend
npm run build
# Output in: frontend/dist
```

### Run Tests
```bash
cd backend
npm test
```

---

## 🌐 Essential URLs

### Development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API Health: `http://localhost:5000/api/health`

### Production (Update after deployment)
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API Health: `https://your-app.railway.app/api/health`

---

## ⚙️ Environment Variables Quick Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-supabase-host.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=true
JWT_SECRET=your-secret-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔍 Quick Troubleshooting

### Frontend not loading?
```bash
# Check build
cd frontend
npm run build

# Check console for errors (F12 in browser)
```

### Backend not responding?
```bash
# Check health endpoint
curl https://your-app.railway.app/api/health

# Check logs in Railway dashboard
```

### CORS errors?
- Add frontend URL to `FRONTEND_URL` in backend env vars
- Restart backend service

### Database connection failed?
- Verify credentials in Supabase dashboard
- Check `DB_SSL=true` is set
- Whitelist Railway IP in Supabase (if needed)

### Emails not sending?
- Verify Gmail App Password
- Check SMTP settings
- Test with: `POST /api/email/test`

---

## 📊 Deployment Platforms

### Recommended Stack (Free Tier)
| Component | Platform | Free Tier | URL |
|-----------|----------|-----------|-----|
| Frontend | Vercel | 100GB bandwidth | vercel.com |
| Backend | Railway | $5 credit/month | railway.app |
| Database | Supabase | 500MB, 2GB bandwidth | supabase.com |
| Email | Gmail SMTP | Free | gmail.com |

### Alternative Stack
| Component | Platform | Free Tier | URL |
|-----------|----------|-----------|-----|
| Frontend | Netlify | 100GB bandwidth | netlify.com |
| Backend | Render | 750 hours/month | render.com |
| Database | Supabase | 500MB, 2GB bandwidth | supabase.com |
| Email | SendGrid | 100 emails/day | sendgrid.com |

---

## ✅ Quick Verification

### After Deployment, Test These:
1. ✅ Frontend loads: `https://your-app.vercel.app`
2. ✅ Backend health: `https://your-app.railway.app/api/health`
3. ✅ Register new user
4. ✅ Login with new user
5. ✅ Book an appointment
6. ✅ Check email received

---

## 🆘 Emergency Commands

### Rollback Frontend (Vercel)
```bash
vercel rollback
```

### View Backend Logs (Railway)
```bash
# Use Railway dashboard
# Or CLI:
railway logs
```

### Restart Backend (Railway)
```bash
# Use Railway dashboard
# Or CLI:
railway restart
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: https://github.com/your-repo/issues

---

## 🎯 Deployment Checklist (Ultra Quick)

- [ ] Tests pass: `cd backend && npm test`
- [ ] Build works: `cd frontend && npm run build`
- [ ] Database created in Supabase
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS configured
- [ ] Test registration/login
- [ ] Test appointment booking
- [ ] Verify emails sent

---

## 💡 Pro Tips

1. **Always test locally first**
   ```bash
   cd backend && npm start
   cd frontend && npm run dev
   ```

2. **Use environment-specific configs**
   - `.env.development` for local
   - `.env.production` for deployment

3. **Monitor logs after deployment**
   - Railway: Check logs tab
   - Vercel: Check Functions tab

4. **Set up alerts**
   - UptimeRobot for uptime monitoring
   - Sentry for error tracking

5. **Keep credentials secure**
   - Never commit `.env` files
   - Use password manager
   - Rotate secrets regularly

---

**Last Updated**: _____________
**Deployment Status**: _____________
**Production URL**: _____________

---

*For complete guide, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)*
*For detailed checklist, see [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)*

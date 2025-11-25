# PeerLearn Deployment Guide

Complete guide to deploy PeerLearn to Vercel.

## ✅ Deployment Fixed!

The build errors have been resolved. The project now includes:
- ✅ Next.js App Router structure (`src/app/`)
- ✅ Home page with features showcase
- ✅ Authentication pages (Sign In/Sign Up)
- ✅ Global CSS with Tailwind
- ✅ Updated dependencies (removed deprecated packages)
- ✅ Fixed Supabase client configuration

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `peerlearn-platform`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

   **Get Supabase Credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy "Project URL" and "anon/public key"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: peerlearn-platform
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

## 🔧 Post-Deployment Setup

### 1. Update Supabase Settings

After deployment, update your Supabase project:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add your Vercel URL to:
   - **Site URL**: `https://your-project.vercel.app`
   - **Redirect URLs**: 
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/**`

### 2. Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` environment variable

### 3. Enable Analytics (Optional)

1. In Vercel Dashboard, go to "Analytics"
2. Enable Vercel Analytics
3. View real-time performance metrics

## 🐛 Troubleshooting

### Build Fails with "Cannot find module"

**Solution**: Ensure all dependencies are in `package.json`
```bash
# Locally test the build
npm run build
```

### Environment Variables Not Working

**Solution**: 
1. Check variable names start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding variables
3. Clear Vercel cache: Settings → General → Clear Cache

### Supabase Connection Fails

**Solution**:
1. Verify environment variables are correct
2. Check Supabase project is active
3. Ensure redirect URLs are configured
4. Check browser console for errors

### 404 on Routes

**Solution**:
- Ensure pages are in `src/app/` directory
- Check file naming: `page.tsx` not `index.tsx`
- Verify Next.js App Router structure

## 📊 Monitoring

### Vercel Analytics
- Real-time visitor data
- Performance metrics
- Core Web Vitals

### Supabase Logs
- Database queries
- Authentication events
- API usage
- Error logs

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Push to main branch** → Production deployment
2. **Push to other branches** → Preview deployment
3. **Pull requests** → Automatic preview URLs

### Disable Auto-Deploy (Optional)

1. Go to Project Settings → Git
2. Toggle "Production Branch" settings
3. Configure deployment branches

## 🚀 Performance Optimization

### 1. Enable Edge Functions
```javascript
// src/app/api/route.ts
export const runtime = 'edge';
```

### 2. Image Optimization
- Use Next.js `<Image>` component
- Configure image domains in `next.config.js`

### 3. Caching
- Static pages cached automatically
- Configure ISR for dynamic content

### 4. Bundle Analysis
```bash
npm install @next/bundle-analyzer
```

## 🔒 Security Checklist

- [ ] Environment variables set correctly
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Security headers configured

## 📈 Scaling

### Free Tier Limits (Vercel)
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- DDoS protection

### Pro Tier ($20/month)
- 1 TB bandwidth
- Advanced analytics
- Password protection
- Custom deployment regions

### Supabase Limits
- **Free**: 500 MB database, 1 GB file storage
- **Pro**: 8 GB database, 100 GB storage
- **Team**: Custom limits

## 🎉 Success!

Your PeerLearn platform is now live! 

**Next Steps:**
1. ✅ Test all features
2. ✅ Set up Supabase database (run migrations)
3. ✅ Configure authentication providers
4. ✅ Invite beta users
5. ✅ Monitor performance
6. ✅ Gather feedback

## 📞 Support

**Deployment Issues:**
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- GitHub Issues: [Create an issue](https://github.com/navyadragon04-star/peerlearn-platform/issues)

**Contact:**
- Email: navyadragon04@gmail.com

---

**Your PeerLearn platform is ready to change the world of education! 🎓✨**

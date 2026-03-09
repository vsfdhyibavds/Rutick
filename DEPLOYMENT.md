# RUTick Deployment Guide

This guide covers deploying RUTick to production environments.

## 🚀 Quick Deploy with Docker

### Prerequisites

- Docker and Docker Compose installed
- MongoDB connection string (MongoDB Atlas recommended)

### Steps

1. **Clone repository**

```bash
git clone <repo-url>
cd rutick
```

2. **Create production .env file**

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with production values:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rutick
JWT_SECRET=your_very_long_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_URL=https://your-domain.com
```

3. **Build and deploy**

```bash
docker-compose up -d
```

4. **Seed database** (optional)

```bash
docker-compose exec backend npm run seed
```

## 📦 Manual Deployment

### Backend Deployment (Heroku)

1. **Create Heroku app**

```bash
heroku create your-rutick-app
```

2. **Add MongoDB addon**

```bash
heroku addons:create mongolab:sandbox
```

3. **Set environment variables**

```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_USER=your_email
heroku config:set SMTP_PASSWORD=your_password
heroku config:set FRONTEND_URL=https://your-frontend.com
```

4. **Deploy**

```bash
git push heroku main
```

### Backend Deployment (AWS)

1. **Create EC2 instance** (Ubuntu 20.04 LTS)

2. **SSH into instance**

```bash
ssh -i key.pem ubuntu@your-instance-ip
```

3. **Install Node.js and MongoDB**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb-org
```

4. **Clone and setup project**

```bash
git clone <repo-url>
cd rutick/backend
npm install
npm start
```

5. **Use PM2 for process management**

```bash
npm install -g pm2
pm2 start src/server.js --name "rutick"
pm2 save
pm2 startup
```

### Frontend Deployment (Netlify)

1. **Connect GitHub**
   - Push project to GitHub
   - Connect repository to Netlify

2. **Configure build settings**
   - Build command: `npm run build` (if using build tools)
   - Publish directory: `.` (root directory)

3. **Set environment variables**
   - `API_URL`: `https://your-api-domain.com/api`

4. **Deploy**
   - Netlify auto-deploys on push to main branch

### Frontend Deployment (Vercel)

```bash
npm install -g vercel
vercel
```

## 🔐 Security Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS for production domain
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Use environment variables for secret keys
- [ ] Configure database backup
- [ ] Set up monitoring and alerts
- [ ] Use password manager for secrets
- [ ] Enable database authentication
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Regular security audits

## 🔧 Production Configuration

### Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name api.rutick.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.rutick.com
```

## 📊 Monitoring

### Application Monitoring

- Use PM2 Plus or New Relic
- Set up error tracking (Sentry)
- Monitor API response times

### Database Monitoring

- Enable MongoDB Cloud monitoring
- Set up automated backups
- Monitor storage usage

### Infrastructure Monitoring

- CPU and memory usage
- Disk space
- Network bandwidth

## 📈 Scaling

### Horizontal Scaling

```bash
# Run multiple instances
pm2 start src/server.js -i 4 --name "rutick"
```

### Load Balancing

- Use Nginx or HAProxy
- Sticky sessions for user continuity

### Caching

- Implement Redis for session management
- Cache API responses

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: cd backend && npm install && npm test
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: your-rutick-app
          heroku_email: your-email@example.com
```

## 📋 Pre-launch Checklist

- [ ] Database is backed up
- [ ] SSL certificate installed
- [ ] Email service configured
- [ ] Domain DNS configured
- [ ] CDN configured (optional)
- [ ] Monitoring deployed
- [ ] Alerts configured
- [ ] API documentation updated
- [ ] Test all workflows
- [ ] Load testing performed
- [ ] Security scan completed

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test MongoDB connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/rutick"
```

### API Not Responding

```bash
# Check application logs
pm2 logs rutick

# Restart application
pm2 restart rutick
```

### CORS Errors

- Check CORS_ORIGIN in .env
- Ensure frontend URL matches exactly

## 📞 Support

For deployment issues:

- Check application logs
- Verify environment variables
- Test database connection
- Check firewall rules

---

**Last Updated**: February 26, 2026

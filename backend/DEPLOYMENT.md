# Deployment Guide

## Local Development

See [QUICKSTART.md](QUICKSTART.md) for local setup.

## Production Deployment Options

### Option 1: Heroku

1. Install Heroku CLI
2. Create Heroku app:

```bash
heroku create your-cafe-api
```

3. Add MongoDB Atlas:

```bash
heroku addons:create mongolab:sandbox
```

4. Set environment variables:

```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set UPI_ID=yourupi@upi
heroku config:set CAFE_NAME=YourCafe
heroku config:set ADMIN_EMAIL=admin@cafe.com
heroku config:set ADMIN_PASSWORD=secure_password
heroku config:set NODE_ENV=production
```

5. Deploy:

```bash
git push heroku main
```

### Option 2: Railway

1. Connect GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

### Option 3: DigitalOcean App Platform

1. Create new app from GitHub
2. Set environment variables
3. Deploy

### Option 4: VPS (Ubuntu)

1. SSH into server
2. Install Node.js and MongoDB:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs mongodb
```

3. Clone repository:

```bash
git clone your-repo-url
cd backend
npm install
```

4. Create .env file with production values

5. Install PM2:

```bash
sudo npm install -g pm2
pm2 start server.js --name cafe-api
pm2 save
pm2 startup
```

6. Setup Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name api.yourcafe.com;

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

7. Enable SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourcafe.com
```

## MongoDB Atlas Setup

1. Create account at mongodb.com
2. Create new cluster (free tier available)
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string
6. Update MONGODB_URI in environment

## Environment Variables Checklist

- [ ] PORT
- [ ] MONGODB_URI
- [ ] JWT_SECRET (use strong random string)
- [ ] UPI_ID
- [ ] CAFE_NAME
- [ ] ADMIN_EMAIL
- [ ] ADMIN_PASSWORD (change from default!)
- [ ] NODE_ENV=production

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Add rate limiting
- [ ] Implement request logging
- [ ] Set up monitoring
- [ ] Regular backups
- [ ] Keep dependencies updated

## Performance Optimization

1. Enable compression:

```javascript
const compression = require('compression');
app.use(compression());
```

2. Add caching headers
3. Use MongoDB indexes
4. Implement pagination
5. Use CDN for static assets

## Monitoring

### PM2 Monitoring

```bash
pm2 monit
pm2 logs cafe-api
```

### Health Check Endpoint

```bash
curl https://api.yourcafe.com/health
```

## Backup Strategy

1. MongoDB Atlas automatic backups
2. Manual backup:

```bash
mongodump --uri="mongodb+srv://..." --out=backup/
```

3. Restore:

```bash
mongorestore --uri="mongodb+srv://..." backup/
```

## Troubleshooting

### Server won't start

- Check MongoDB connection
- Verify environment variables
- Check port availability
- Review logs

### Payment QR not generating

- Verify UPI_ID format
- Check qrcode package installation
- Review generateQR.js logs

### Admin can't login

- Verify admin exists in database
- Check JWT_SECRET is set
- Verify password hash

## Scaling

### Horizontal Scaling

- Use load balancer
- Multiple server instances
- Shared MongoDB cluster
- Redis for session management

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add caching layer

## CI/CD Pipeline

Example GitHub Actions:

```yaml
name: Deploy

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
          node-version: '18'
      - run: npm install
      - run: npm test
      - name: Deploy to production
        run: |
          # Your deployment commands
```

## Support

For production issues:
- Check server logs
- Monitor error rates
- Review MongoDB metrics
- Check API response times

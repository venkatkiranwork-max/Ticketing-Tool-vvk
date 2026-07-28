# Deployment Guide

This guide covers deploying the TicketFlow application to production.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)
- MongoDB instance (production)
- Cloudinary account (for file uploads)
- Email service credentials (Gmail, SendGrid, etc.)

## Environment Setup

### 1. Backend Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp backend/.env.example backend/.env
```

Required variables:
- `DATABASE_URL`: MongoDB connection string
- `JWT_SECRET`: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `CLIENT_URL`: Frontend URL
- `SMTP_*`: Email service credentials
- `CLOUDINARY_*`: File upload service credentials

### 2. Frontend Configuration

The frontend uses environment variables from `.env`:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Local Development

### Using Docker Compose

```bash
docker-compose up
```

This starts:
- MongoDB on port 27017
- Backend on port 5000
- Frontend on port 5173

### Without Docker

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

### Option 1: Docker

Build and run:
```bash
docker build -t ticketflow:latest .
docker run -p 5000:5000 --env-file .env ticketflow:latest
```

### Option 2: Traditional Server

Backend:
```bash
npm install
npm run build
npm start
```

Frontend:
```bash
npm install
npm run build
# Serve dist/ with nginx or your preferred web server
```

### Option 3: Cloud Platform (Vercel, Netlify, Heroku)

1. **Frontend (Vercel/Netlify)**:
   - Connect your repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Configure environment variables

2. **Backend (Heroku/Railway/Render)**:
   - Set buildpack to Node.js
   - Configure all `.env` variables in platform settings
   - Set Procfile: `web: npm start`

## CI/CD Pipeline

GitHub Actions workflow is configured in `.github/workflows/ci-cd.yml`.

The pipeline:
1. Runs tests on backend and frontend
2. Builds both applications
3. Runs security scans
4. Deploys to production (on push to main)

### Setup GitHub Actions

1. Add secrets to your repository:
   - `DOCKER_REGISTRY_URL`
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
   - `DEPLOYMENT_KEY`
   - `DEPLOYMENT_HOST`

2. Update the deploy job with your deployment credentials

## Database Migrations

MongoDB automatically creates indexes on startup. For manual operations:

```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017"

# Create indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.workspaces.createIndex({ ownerId: 1 })
db.projects.createIndex({ workspaceId: 1 })
db.issues.createIndex({ projectId: 1 })
db.auditLogs.createIndex({ userId: 1 })
```

## Monitoring

### Logs

Backend logs are output to console. For production, configure:
- Log aggregation service (DataDog, New Relic, etc.)
- Error tracking (Sentry)
- Performance monitoring (APM)

### Health Checks

Endpoint: `GET /api/v1/health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600,
  "environment": "production"
}
```

## Security Checklist

- [ ] Change all default secrets and keys
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for production domain
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Enable database backups
- [ ] Setup audit logging
- [ ] Configure email verification
- [ ] Enable 2FA for admin accounts

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous container
docker ps -a
docker run -p 5000:5000 ticketflow:previous-tag

# Or revert code and redeploy
git revert <commit-hash>
git push origin main
# GitHub Actions will trigger new deployment
```

## Support

For deployment issues:
1. Check logs: `docker logs <container-id>`
2. Verify environment variables are set correctly
3. Ensure database connection is working
4. Check that all required ports are open

## Scaling

For production scale:

1. **Database**: Use MongoDB Atlas or managed MongoDB service
2. **Storage**: Use S3 or Cloudinary for file storage
3. **Cache**: Add Redis for session/query caching
4. **Load Balancing**: Use nginx or cloud load balancer
5. **CDN**: Cache frontend assets with Cloudflare or similar
6. **Monitoring**: Setup comprehensive monitoring and alerts

## Maintenance

### Regular Tasks

- Monitor disk space
- Review and archive old logs
- Update dependencies (npm audit)
- Backup databases daily
- Review audit logs monthly
- Update SSL certificates (90 days before expiry)

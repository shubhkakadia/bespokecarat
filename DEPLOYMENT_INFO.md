# Bespoke Carat - Deployment Information

## Project Overview

**Application Name:** Bespoke Carat
**Type:** Next.js E-commerce Application (Lab-Grown Diamonds)
**Framework:** Next.js 15.3.4 (React 19.0.0)
**Router:** Pages Router (API) + App Router (Frontend)
**Database:** MySQL with Sequelize ORM
**State Management:** Redux Toolkit + Redux Persist
**Node Version:** 18.x or higher recommended

---

## Server Requirements

### Minimum Requirements
- **OS:** Linux (Ubuntu 20.04+ recommended), Windows Server, or macOS
- **Node.js:** v18.x or higher
- **npm:** v9.x or higher
- **MySQL:** v8.0 or higher
- **Memory:** 2GB RAM minimum (4GB recommended)
- **Storage:** 10GB minimum (20GB+ recommended for media uploads)
- **Port:** 3000 (default, configurable)

### Production Hosting Recommendations
- **VPS/Cloud:** AWS EC2, DigitalOcean Droplet, Google Cloud Compute
- **Platform:** Vercel, Netlify (requires MySQL external hosting)
- **Database:** AWS RDS MySQL, DigitalOcean Managed Database, or self-hosted MySQL

---

## Database Configuration

### Current Development Database
```
Host: localhost
Port: 3306 (default MySQL)
Database Name: bespokecarat
Username: root
Password: (empty/blank)
```

### Production Database Setup

**IMPORTANT:** For production, create a new database with secure credentials.

```sql
-- 1. Create database
CREATE DATABASE bespokecarat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create dedicated user (REPLACE with secure credentials)
CREATE USER 'root'@'localhost' IDENTIFIED BY 'YOUR_SECURE_PASSWORD_HERE';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON bespokecarat.* TO 'bespoke_user'@'localhost';
FLUSH PRIVILEGES;
```

### Database Tables (Auto-Created by Sequelize)

The application will automatically create the following tables on first run:

**User Tables:**
- `admin` - Admin users with master-admin role support
- `customers` - Customer accounts
- `sessions` - Authentication sessions (token-based)

**Product Tables:**
- `diamonds` + `diamondVariants` - Diamond products with color/clarity/carat variants
- `melees` + `sieveSize` - Melee diamonds with sieve sizes
- `colorStone` + `colorStoneVariants` - Color stone products
- `cuts` + `cutVariants` - Diamond cuts
- `layout` + `diamondDetails` - Diamond layouts
- `alphabets` + `alphabetVariants` - Alphabet-shaped diamonds
- `medias` - Shared media files (images/videos) for all products

---

## Environment Variables

### Required Environment Variables

Create a `.env` file in the project root with the following:

```env
# Database Configuration (PRODUCTION)
NEXT_APP_HOST=localhost                    # Change to your DB host (e.g., rds-instance.amazonaws.com)
NEXT_APP_DBNAME=bespokecarat              # Database name
NEXT_APP_USERNAME=root            # Database user (CHANGE IN PRODUCTION)
NEXT_APP_PASSWORD=YOUR_SECURE_PASSWORD    # Database password (CHANGE IN PRODUCTION)

# Application URLs
NEXT_APP_BASE_URL=https://bespokecarat.com           # Your production domain
NEXT_PUBLIC_BASE_URL=https://bespokecarat.com        # Public-facing URL
NEXTAUTH_URL=https://bespokecarat.com                # Auth URL

# EmailJS Configuration (Contact Form)
# Get these from https://www.emailjs.com/
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_o9996m5       # Your EmailJS Service ID
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_e010m7z     # Your EmailJS Template ID
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=lRcjI0hfyZyP82jUB     # Your EmailJS Public Key
```

### Environment Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_APP_HOST` | Yes | MySQL database host address |
| `NEXT_APP_DBNAME` | Yes | MySQL database name |
| `NEXT_APP_USERNAME` | Yes | MySQL database username |
| `NEXT_APP_PASSWORD` | Yes | MySQL database password |
| `NEXT_APP_BASE_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_BASE_URL` | Yes | Frontend public URL |
| `NEXTAUTH_URL` | Yes | Authentication base URL |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | Yes | EmailJS service identifier |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | Yes | EmailJS email template ID |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | Yes | EmailJS public API key |

---

## EmailJS Setup (Contact Form)

The application uses EmailJS for the contact form functionality.

### Setup Steps

1. **Create EmailJS Account**
   - Visit: https://www.emailjs.com/
   - Sign up for a free account (100 emails/month free tier)

2. **Add Email Service**
   - Connect your email provider (Gmail, Outlook, SendGrid, etc.)
   - Note the Service ID (e.g., `service_o9996m5`)

3. **Create Email Template**
   - Go to Email Templates → Create New Template
   - Use these template variables:
     - `{{name}}` - Customer name
     - `{{email}}` - Customer email
     - `{{phone_number}}` - Customer phone number
     - `{{enquiry_type}}` - Type of inquiry
     - `{{time}}` - Submission timestamp
     - `{{subject}}` - Subject line
     - `{{message}}` - Customer message
     - `{{photos_urls}}` - Uploaded photo URLs (comma-separated)

4. **Sample Email Template**
```
New Inquiry from Bespoke Carat Website

Name: {{name}}
Email: {{email}}
Phone: {{phone_number}}
Enquiry Type: {{enquiry_type}}
Time: {{time}}

Subject: {{subject}}

Message:
{{message}}

Attached Photos:
{{photos_urls}}
```

5. **Get Public Key**
   - Go to Account → API Keys
   - Copy your Public Key
   - Add to `.env` as `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Email Features
- Supports up to 5 photo uploads (10MB each)
- Photos saved to `public/enquiry/` with UUID names
- Direct photo links included in email
- Success/error feedback to user

---

## File Upload Configuration

### Upload Directory Structure
```
bespokecarat/
├── uploads/              # Product media (auto-created, NOT in git)
│   ├── diamonds/
│   ├── melee/
│   ├── colorstone/
│   ├── cuts/
│   ├── layouts/
│   └── alphabets/
└── public/
    └── enquiry/          # Contact form photos (auto-created)
```

### Important Notes
- **Upload Limit:** 50MB per file (configured in `next.config.mjs`)
- **Permissions:** Ensure write permissions on `uploads/` and `public/enquiry/`
- **Storage:** Plan for adequate disk space (media files can grow large)
- **Backup:** Include `uploads/` directory in your backup strategy

### Linux/Unix Permissions
```bash
# Set proper permissions (run in project root)
mkdir -p uploads public/enquiry
chmod 755 uploads public/enquiry
chown -R www-data:www-data uploads public/enquiry  # Or your web server user
```

---

## Deployment Steps

### 1. Pre-Deployment Checklist

- [ ] MySQL database created and accessible
- [ ] Secure database credentials generated
- [ ] `.env` file configured with production values
- [ ] EmailJS account set up and tested
- [ ] Upload directories created with proper permissions
- [ ] Node.js 18+ and npm installed on server
- [ ] Domain/subdomain DNS configured
- [ ] SSL certificate installed (Let's Encrypt recommended)

### 2. Clone and Install

```bash
# Clone repository
git clone <repository-url> bespokecarat
cd bespokecarat

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration

```bash
# Create .env file
nano .env  # or vim/vi

# Paste production environment variables
# Save and exit

# Verify env file (DO NOT commit to git)
cat .env
```

### 4. Database Initialization

```bash
# Test database connection
# The app will auto-sync tables on first run
npm run build

# Check console for "DB CONNECTED !!" and "### RESYNCED ###"
```

### 5. Create Master Admin Account

You need to create the first admin account manually via API:

```bash
# Using curl (replace values)
curl -X POST http://localhost:3000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "masteradmin",
    "name": "Master Administrator",
    "email": "bespokecarat@gmail.com",
    "password": "SECURE_PASSWORD_HERE",
    "role": "master-admin"
  }'

# Or use Postman/Insomnia with the above JSON body
```

**Default Admin Credentials (CHANGE IMMEDIATELY):**
```
Username: masteradmin
Email: admin@bespokecarat.com
Password: [Set during creation]
Role: master-admin
```

### 6. Build and Start

```bash
# Build for production
npm run build

# Start production server
npm start

# Server starts on port 3000 by default
# Access at: http://localhost:3000
```

### 7. Process Management (Recommended)

Use PM2 to keep the application running:

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "bespokecarat" -- start

# Auto-restart on reboot
pm2 startup
pm2 save

# Monitor application
pm2 monit

# View logs
pm2 logs bespokecarat

# Restart application
pm2 restart bespokecarat
```

### 8. Nginx Reverse Proxy (Production)

```nginx
# /etc/nginx/sites-available/bespokecarat.com

server {
    listen 80;
    listen [::]:80;
    server_name bespokecarat.com www.bespokecarat.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name bespokecarat.com www.bespokecarat.com;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/bespokecarat.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bespokecarat.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max upload size (match Next.js config)
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/bespokecarat.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d bespokecarat.com -d www.bespokecarat.com

# Auto-renewal is set up automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## Application URLs and Routes

### Public Routes (No Authentication)
- **Homepage:** `https://bespokecarat.com/`
- **Collections:** `https://bespokecarat.com/collections/{type}`
  - Types: `diamonds`, `melee`, `colorstone`, `cuts`, `layouts`, `alphabets`
- **Product Detail:** `https://bespokecarat.com/products/{slug}`
- **Diamond Journal:** `https://bespokecarat.com/diamondjournal/*`
- **About Us:** `https://bespokecarat.com/about`
- **Contact:** `https://bespokecarat.com/contact`
- **Login:** `https://bespokecarat.com/login`
- **Signup:** `https://bespokecarat.com/signup`

### Admin Portal (Master Admin & Admin Access)
- **Admin Dashboard:** `https://bespokecarat.com/admin`
- **Products Management:** `https://bespokecarat.com/admin/products`
- **Add Product:** `https://bespokecarat.com/admin/products/addproduct`
- **Edit Product:** `https://bespokecarat.com/admin/products/{id}`
- **Orders:** `https://bespokecarat.com/admin/orders`
- **Users:** `https://bespokecarat.com/admin/users`
- **Enquiries:** `https://bespokecarat.com/admin/enquiry`
- **Settings:** `https://bespokecarat.com/admin/settings`

### Customer Portal (Customer Access)
- **Customer Profile:** `https://bespokecarat.com/customer/profile`
- **My Orders:** `https://bespokecarat.com/customer/orders`
- **Wishlist:** `https://bespokecarat.com/customer/wishlist`
- **Settings:** `https://bespokecarat.com/customer/settings`

### API Endpoints

**Authentication:**
- `POST /api/signin` - User login
- `POST /api/signup` - Customer registration
- `POST /api/logout` - Logout
- `POST /api/admin/create-admin` - Create admin account

**Admin Product Management:**
- `POST /api/admin/product/diamond/add-diamond`
- `POST /api/admin/product/melee/add-melee`
- `POST /api/admin/product/colorstone/add-colorstone`
- `POST /api/admin/product/cut/add-cut`
- `POST /api/admin/product/layout/add-layout`
- `POST /api/admin/product/alphabet/add-alphabet`
- `PUT /api/admin/product/{type}/edit-{type}`
- `DELETE /api/admin/product/delete-product`
- `DELETE /api/admin/product/media-delete`

**Client APIs:**
- `GET /api/client/homepage` - Homepage data
- `GET /api/client/product/collection` - Product collections
- `GET /api/client/product/search` - Search products

**Media:**
- `GET /api/media/[...path]` - Serve media files

**Enquiry:**
- `POST /api/enquiry/upload-images` - Upload enquiry photos
- `GET /api/enquiry/[filename]` - Serve enquiry images

---

## User Roles and Permissions

### User Types

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **master-admin** | Full Access | Create admins, manage all products, view all users, access all admin features |
| **admin** | Admin Access | Manage products, orders, view users, access admin portal (cannot create admins) |
| **customer** | Customer Access | Browse products, place orders, manage profile, wishlist |

### Default Access Rules
- Admin routes accessible by `master-admin` and `admin`
- Customer routes accessible by `master-admin`, `admin`, and `customer`
- Public routes accessible to everyone

---

## Security Considerations

### Critical Security Tasks

1. **Change Default Credentials**
   ```bash
   # Never use default/empty database passwords in production
   # Generate strong password:
   openssl rand -base64 32
   ```

2. **Database Security**
   - Use dedicated database user (not root)
   - Restrict database access by IP
   - Enable MySQL SSL connections
   - Regular database backups

3. **Environment Variables**
   - Never commit `.env` to git (already in `.gitignore`)
   - Use different credentials for dev/staging/production
   - Rotate credentials periodically

4. **File Upload Security**
   - Uploads limited to 50MB per file
   - File type validation in place (images/videos only)
   - Stored outside web root where possible
   - Regular cleanup of orphaned files

5. **Session Security**
   - Tokens stored in httpOnly cookies
   - Session expiration implemented
   - Bcrypt password hashing (cost factor 10)

6. **HTTPS/SSL**
   - Always use SSL in production
   - Redirect HTTP to HTTPS
   - Use HSTS headers

7. **Admin Account Protection**
   - Strong password requirements
   - Limit master-admin accounts
   - Regular audit of admin users

---

## Backup Strategy

### Database Backups

```bash
# Daily automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="bespokecarat"
DB_USER="root"
DB_PASS="YOUR_PASSWORD"

# Create backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/bespokecarat_$DATE.sql

# Compress
gzip $BACKUP_DIR/bespokecarat_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### File Backups

```bash
# Backup uploads directory
tar -czf /backups/files/uploads_$(date +%Y%m%d).tar.gz uploads/

# Backup enquiry photos
tar -czf /backups/files/enquiry_$(date +%Y%m%d).tar.gz public/enquiry/
```

### Cron Jobs

```bash
# Edit crontab
crontab -e

# Add daily backups (2 AM)
0 2 * * * /path/to/backup-database.sh
15 2 * * * /path/to/backup-files.sh
```

---

## Monitoring and Maintenance

### Health Checks

```bash
# Check application status
pm2 status

# Check database connectivity
mysql -u bespoke_user -p -e "SELECT 1;"

# Check disk space
df -h

# Check upload directories
du -sh uploads/
```

### Log Files

```bash
# PM2 logs
pm2 logs bespokecarat --lines 100

# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

### Performance Monitoring

- Monitor CPU/RAM usage
- Database query performance
- Upload directory size
- Response times
- Error rates

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
# Verify MySQL user has correct permissions
```

**Upload Fails**
```bash
# Check directory permissions
ls -la uploads/
chmod 755 uploads/
chown -R www-data:www-data uploads/
```

**Port 3000 Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process or change port in next.config.js
```

**Build Fails**
```bash
# Clear cache and rebuild
rm -rf .next
npm cache clean --force
npm install
npm run build
```

**Email Not Sending**
- Verify EmailJS credentials in `.env`
- Check EmailJS account limits (100/month free tier)
- Review EmailJS dashboard for errors
- Ensure template variables match code

---

## Development vs Production

### Development (.env)
```env
NEXT_APP_HOST=localhost
NEXT_APP_DBNAME=bespokecarat
NEXT_APP_USERNAME=root
NEXT_APP_PASSWORD=
NEXT_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Production (.env)
```env
NEXT_APP_HOST=production-db-host.com
NEXT_APP_DBNAME=bespokecarat
NEXT_APP_USERNAME=bespoke_user
NEXT_APP_PASSWORD=STRONG_SECURE_PASSWORD
NEXT_APP_BASE_URL=https://bespokecarat.com
NEXT_PUBLIC_BASE_URL=https://bespokecarat.com
NEXTAUTH_URL=https://bespokecarat.com
```

---

## Commands Reference

```bash
# Development
npm run dev              # Start dev server (Turbopack)

# Production
npm run build            # Build for production
npm start                # Start production server

# Maintenance
npm run lint             # Lint code
npm install              # Install dependencies
npm update               # Update dependencies

# PM2
pm2 start npm --name "bespokecarat" -- start
pm2 stop bespokecarat
pm2 restart bespokecarat
pm2 delete bespokecarat
pm2 logs bespokecarat
pm2 monit

# Git
git pull origin main     # Update code
git status               # Check status
git log --oneline -10    # Recent commits
```

---

## Support and Documentation

### Additional Documentation Files
- `CLAUDE.md` - Development guidelines and architecture
- `EMAILJS_SETUP.md` - Email configuration details
- `README.md` - Project overview (if exists)

### Git Repository
- **Current Branch:** `frontend`
- **Main Branch:** (not specified in git status)

### Key Dependencies
- Next.js 15.3.4
- React 19.0.0
- Sequelize 6.37.7
- MySQL2 3.14.1
- Bcrypt 6.0.0
- Redux Toolkit 2.8.2
- Multer 2.0.2

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application accessible at production URL
- [ ] HTTPS/SSL working correctly
- [ ] Database connection successful
- [ ] Master admin login working
- [ ] Product pages loading
- [ ] Image uploads working
- [ ] Contact form sending emails
- [ ] All API endpoints responding
- [ ] Admin portal accessible
- [ ] Customer registration working
- [ ] PM2 process running
- [ ] Backups configured
- [ ] Monitoring in place

---

## Important Notes

1. **NEVER commit `.env` files to git** - They contain sensitive credentials
2. **Change all default passwords** before going live
3. **Test email functionality** before launch (EmailJS free tier: 100 emails/month)
4. **Plan for media storage growth** - Uploads can grow large over time
5. **Regular backups are critical** - Automate database and file backups
6. **Monitor upload directories** - Set up disk space alerts
7. **Keep dependencies updated** - Run `npm update` regularly (test first)
8. **Use SSL certificates** - Let's Encrypt is free and automated
9. **Restrict database access** - Use firewall rules and strong passwords
10. **Document any customizations** - Keep deployment notes updated

---

## Emergency Contacts

**Database Issues:**
- Check MySQL error logs: `/var/log/mysql/error.log`
- Review Sequelize connection config: `config/dbConfig.js`

**Application Crashes:**
- PM2 logs: `pm2 logs bespokecarat`
- Next.js logs: `.next/` directory
- System logs: `journalctl -u nginx`

**File Upload Issues:**
- Check permissions: `ls -la uploads/`
- Review multer config: `lib/middlewares/fileUpload.js`
- Check disk space: `df -h`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-14
**Deployment Status:** Ready for Production Deployment

---

## Security Warning

This file contains **SENSITIVE INFORMATION** including database credentials, API keys, and system configuration details.

**DO NOT:**
- Commit this file to public repositories
- Share via unsecured channels
- Store in publicly accessible locations
- Include in client-facing documentation

**PROTECT THIS FILE** with appropriate access controls and encryption.

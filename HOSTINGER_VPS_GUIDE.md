# Hostinger VPS Deployment Guide
**Project:** Beyondtee (Next.js & NestJS)
**Hosting Requirement:** Hostinger VPS (Virtual Private Server) with Ubuntu 22.04 or 24.04

This guide explains how to deploy your custom Node.js/Docker application to a Hostinger VPS. Since the code is now securely on GitHub, you can pull it directly to your server without needing to upload ZIP files.

---

## Step 1: Connect to your Server (SSH)
1. Go to your Hostinger Dashboard → **VPS** -> **Manage**.
2. Find your **VPS IP Address**, **Username** (usually `root`), and your SSH Password.
3. Open your computer's terminal (Command Prompt/PowerShell on Windows, or Terminal on Mac).
4. Type the following command and press Enter:
   ```bash
   ssh root@YOUR_VPS_IP_ADDRESS
   ```
5. Type `yes` if prompted, then enter your SSH Password.

## Step 2: Install Required Software (Docker & Git)
Hostinger VPS servers are usually empty Linux boxes. We need to install Docker (to run the app) and Git (to download the code).

Run these commands one by one:
```bash
# Update the server's package list
sudo apt update && sudo apt upgrade -y

# Install Git
sudo apt install git -y

# Install Docker and Docker Compose
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker
```

## Step 3: Download your Code from GitHub
1. Navigate to the main web folder:
   ```bash
   cd /var/www
   ```
   *(If the folder doesn't exist, create it: `mkdir /var/www && cd /var/www`)*
2. Clone your repository:
   ```bash
   git clone https://github.com/Rushikesh5102/BeyondTee.git
   cd BeyondTee
   ```

## Step 4: Add your Passwords / Configuration (`.env` files)
GitHub ignores `.env` files for security. You must create them manually on the server.

**1. Create the Backend Config:**
```bash
nano backend/.env
```
*Paste your production Supabase database URL, Cloudinary keys, and Hostinger SMTP details here. Then press `Ctrl + X`, type `Y`, and press `Enter` to save.*

**2. Create the Frontend Config:**
```bash
nano web/.env.local
```
*Paste your `NEXT_PUBLIC_GA_ID`, `NEXTAUTH_SECRET`, etc. here. Then press `Ctrl + X`, type `Y`, and press `Enter` to save.*

## Step 5: Start the Application!
Now that the code and the passwords are on the server, tell Docker to build and run everything:
```bash
sudo docker-compose -f docker-compose.prod.yml up --build -d
```
Docker will now download Node.js, install packages, and start the Next.js and NestJS servers in the background. It will take a few minutes the first time.

You can verify they are running by typing:
```bash
sudo docker ps
```

---

## Step 6: Connect your Domain Name (Nginx & SSL)
Right now, the app is running on your server's IP address on ports `3000` and `3001`. We need to route web traffic (`yourdomain.in`) to these ports.

**1. Install Nginx (Web Server) and Certbot (Free SSL Certificates):**
```bash
sudo apt install nginx -y
sudo apt install certbot python3-certbot-nginx -y
```

**2. Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/beyondtee
```
Paste this configuration (Replace `yourdomain.in` with your actual domain):
```nginx
server {
    server_name yourdomain.in www.yourdomain.in;

    # Route /api traffic to the NestJS Backend (Port 3001)
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Route all other traffic to the Next.js Frontend (Port 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*Save with `Ctrl + X`, `Y`, `Enter`.*

**3. Enable the configuration and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/beyondtee /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**4. Install the Free SSL Certificate (HTTPS):**
```bash
sudo certbot --nginx -d yourdomain.in -d www.yourdomain.in
```
Follow the prompts, and Certbot will automatically secure your website with HTTPS.

---
## 🎉 Deployment Complete!
Your Next.js and NestJS applications are now fully deployed and securely connected to your Hostinger domain.

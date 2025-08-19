# 🚀 LinkedIn Scraper Backend (Node.js + Express)

This project is a **Node.js + Express.js backend** application with a **MySQL database**.  
It provides APIs for **LinkedIn profile scraping and management** using **Phantombuster** and supports **JWT-based authentication** plus **Google login integration**.

---

## ✨ Features
- 🔑 JWT Authentication (Login & Register)
- 🔗 Google Login Integration
- 📡 LinkedIn profile scraping via Phantombuster
- ⏱️ Background scraping with configurable polling interval
- 📂 Modular structure (controllers, routes, middlewares, models, etc.)
- 🛡️ Request validation included

---

## ⚙️ Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a reference.

## env file
## Database
DB_NAME=linkedin_app
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
NODE_ENV=development or production

# Server
PORT=2000
JWT_SECRET=supersecret

# Google OAuth
GOOGLE_CLIENT_ID=

# Phantombuster Integration
API_KEY=your-phantombuster-api-key
AGENT_ID=phantombuster-agent-id
POLL_INTERVAL_MS=60000
BASE_URL=http://localhost:2000
PHANTOM_PROFILE_SCRAPER_ID=phantombuster-scraper-id


## ⚙️ how to run project

Clone the repository

git clone https://github.com/yourusername/linkedin-scraper-backend.git
cd linkedin-scraper-backend


## Install dependencies

npm install


## Setup environment file

cp .env.example .env

## migration run
npx sequelize-cli db:migrate


## run  project

npm run dev

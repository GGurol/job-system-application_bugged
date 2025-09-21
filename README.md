# CareerPilot

**Navigate your career with confidence** - An intelligent job application system that helps you find and apply to the perfect jobs.

## ✨ Features

### 🎯 **Smart Job Discovery**
- **Swipe Interface** - Tinder-like job discovery experience
- **AI-Powered Matching** - Intelligent job recommendations based on your profile
- **Real-time Job Feed** - Fresh job postings from multiple sources

### 🤖 **Automated Applications**
- **One-Click Apply** - Swipe right to automatically apply
- **CV Management** - Upload and manage your resume
- **Auto-Fill Forms** - Automated form completion for job applications
- **Application Tracking** - Monitor all your applications in one place

### 👤 **Profile Management**
- **LinkedIn Integration** - Connect your professional profile
- **Skills & Keywords** - Set preferences for better job matching
- **Progress Tracking** - Monitor your application success rates
- **Personal Dashboard** - Track your career journey

### 🎨 **User Experience**
- **Dark Mode** - Beautiful dark and light themes
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Clean, professional interface
- **Smooth Animations** - Delightful user interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Express.js, PostgreSQL
- **Scraping**: Playwright for job data collection
- **Automation**: Playwright for auto-applications
- **Deployment**: Docker + Docker Compose

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/GGurol/job-system-application_bugged.git
   ```

2. **Navigate to project directory**
   ```bash
   cd job-system-application_bugged
   ```

4. **Build and up the docker**
   ```bash
   docker compose up --build -d
   ```

5. **Seed the database**
   ```bash
   docker compose exec -T db psql -U postgres -d jobapp < scripts/seed-database.sql
   ```

6. **Access the application**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001/healty](http://localhost:3001/healty)

## 📋 Environment Variables

See `.env` for required configuration values including:
- Database credentials (PostgreSQL)
- Service endpoints
- Authentication secrets

## 🎯 How It Works

1. **Sign Up** - Create your account and complete your profile
2. **Upload CV** - Add your resume for automatic applications
3. **Set Preferences** - Add skills and keywords for better matching
4. **Swipe Jobs** - Discover and apply to jobs with simple swipes
5. **Track Progress** - Monitor your applications and success rates


## 📱 Screenshots

- **Modern Login/Register** - Clean, animated forms with dark mode support
- **Job Swiping** - Intuitive swipe interface for job discovery
- **Profile Management** - Comprehensive profile setup and management
- **Application Tracking** - Monitor all your job applications
- **Dashboard** - Overview of your career journey



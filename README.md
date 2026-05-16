# BIT-Meets — College Meeting Management Platform

A full-stack web application built to streamline college meeting scheduling, attendance tracking, and participant communication — reducing manual coordination effort by **60%**.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Material UI, JavaScript (ES6+) |
| Backend | Node.js, Express.js, REST API |
| Database | MySQL, Sequelize ORM |
| Auth | JWT Authentication, Google OAuth 2.0 |
| Automation | node-cron, Nodemailer |

---

## ✨ Features

- 📅 **Template-based Meeting Scheduling** — Create reusable meeting templates for recurring events
- 👥 **Real-time Attendance Tracking** — Mark and monitor participant attendance dynamically
- 📧 **Automated Email Notifications** — Notify participants automatically on scheduling and updates
- 🔁 **Recurring Meetings** — Auto-schedule daily / weekly / monthly meetings using node-cron
- 🔐 **Google OAuth 2.0** — Secure single sign-on for students and faculty
- 🛡️ **Role-Based Access Control** — Separate dashboards and permissions for Admin, Faculty, and Student roles
- 🗄️ **Normalized MySQL Schema** — Reliable data integrity across all meeting lifecycle operations

---

## 🧠 JavaScript — Core of the Project

JavaScript powers every layer of this application:

- **React.js** — Component-driven UI with hooks (`useState`, `useEffect`) for dynamic rendering
- **Node.js + Express.js** — RESTful API backend with MVC architecture
- **Sequelize ORM** — JS-based MySQL model definitions and migrations
- **jsonwebtoken + bcrypt** — JS libraries for JWT auth and password hashing
- **Passport.js** — Google OAuth 2.0 middleware
- **node-cron** — JavaScript-based task scheduler for recurring meetings
- **Nodemailer** — Automated email notifications in JavaScript

---

## 📁 Project Structure

```
MeetsOrganization/
├── client/                 # React.js Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   └── App.js
├── server/                 # Node.js + Express Backend
│   ├── controllers/        # Business logic
│   ├── models/             # Sequelize ORM models
│   ├── routes/             # API route definitions
│   ├── middleware/         # JWT auth middleware
│   └── index.js
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MySQL
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Shanjai24/MeetsOrganization.git
cd MeetsOrganization

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Variables

Create a `.env` file in the `/server` directory:

```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=bitmeets
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run the App

```bash
# Start backend
cd server
npm start

# Start frontend
cd client
npm start
```

---

## 👤 Author

**Shanjai M R**  
B.Tech Information Technology — Bannari Amman Institute of Technology  
📧 shanjaimr245@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/shanjaimr) | [GitHub](https://github.com/Shanjai24) | [LeetCode](https://leetcode.com/Shanjai24)

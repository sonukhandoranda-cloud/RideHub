<p align="center">
  <h1 align="center">🚖 RideHub</h1>
  <h3 align="center">Full Stack Ride Booking Application</h3>
</p>

RideHub is a full-stack ride booking application built using modern web technologies. It provides secure authentication, ride booking, real-time location tracking, distance-based fare calculation, and live ride updates using Socket.io. The application includes separate interfaces for users and captains, Google Maps integration, JWT authentication, and a responsive user experience. The frontend is deployed on Vercel, the backend is deployed on Render, and MongoDB Atlas is used for data storage.



- ## 📚 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Run the Application](#-run-the-application)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Run the Application](#-run-the-application)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)


## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React.js, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, bcrypt |
| Maps | Google Maps API |
| Real-Time Communication | Socket.IO |
| Deployment | Vercel (Frontend), Render (Backend) |
| Tools | Git, GitHub, Postman, VS Code |


## ✨ Features

- 🔐 Secure user authentication using JWT
- 🚗 Ride booking with pickup and destination selection
- 📍 Real-time location tracking using Google Maps API
- 💰 Distance-based fare estimation
- 👨‍✈️ Separate dashboards for User and Captain (Driver)
- 🔄 Live ride status updates using Socket.IO
- 📝 Ride history management
- 🔒 Role-based authorization and protected routes
- ☁️ MongoDB Atlas for cloud database storage
- 🚀 Frontend deployed on Vercel and Backend deployed on Render



## 📂 Project Structure

```text
RideHub/
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── assets/
│   └── package.json
└── README.md
```
## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sonukhandoranda-cloud>/RideHub.git
cd RideHub
```

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../Backend
npm install
```

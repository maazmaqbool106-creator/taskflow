# TaskFlow — React Native Task Manager 🚀

TaskFlow is a full-stack task management mobile application built with **React Native, Expo, TypeScript, Node.js, Express.js, and MongoDB Atlas**.

The application allows users to manage their tasks through a modern mobile interface while communicating with a RESTful backend for task data and authentication.

## 📱 Overview

TaskFlow provides a clean productivity-focused interface for creating, managing, searching, and tracking tasks.

The project was built to practice and demonstrate **mobile application development, REST API integration, backend development, database management, authentication, and full-stack application architecture**.

## ✨ Features

### 📋 Task Management

- Create new tasks
- View task details
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Task categories
- Task priorities
- Task descriptions
- Due dates

### 📊 Dashboard

- Pending task statistics
- Completed task statistics
- Overdue task statistics
- Task completion progress
- Dynamic greeting
- Task overview

### 🔍 Search & Navigation

- Search tasks
- Category-based navigation
- Task details navigation
- Bottom tab navigation
- Stack navigation
- Modern navigation icons

### 🔐 Authentication

- User registration
- User login
- Forgot-password screen
- Authentication flow
- Backend API integration

### 🎨 UI & Experience

- Modern dark-mode interface
- Purple/indigo primary theme
- Responsive mobile layout
- Task cards
- Floating action button
- Empty states
- Progress indicators
- Modern icons
- Pull-to-refresh support

## 🛠️ Technology Stack

### Frontend

- **React Native**
- **Expo SDK 54**
- **TypeScript**
- **React Navigation**
- **Axios**
- **React Native Paper**
- **AsyncStorage**
- **Expo Vector Icons**

### Backend

- **Node.js**
- **Express.js**
- **REST API**
- **MongoDB Atlas**
- **Mongoose**
- **dotenv**

### Development Tools

- VS Code
- Git & GitHub
- Expo Development Build
- Postman
- MongoDB Atlas

## 🏗️ Architecture

TaskFlow follows a client-server architecture:

```text
┌───────────────────────────────┐
│       React Native App        │
│                               │
│  Screens / Components         │
│  Navigation                   │
│  Context / State              │
│  API Services                 │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│       Node.js + Express       │
│                               │
│  Routes                       │
│  Controllers / Logic          │
│  Authentication               │
│  Task CRUD                    │
└───────────────┬───────────────┘
                │
                │ Mongoose
                ▼
┌───────────────────────────────┐
│         MongoDB Atlas         │
│                               │
│  Users                        │
│  Tasks                        │
└───────────────────────────────┘
```

## 📂 Frontend Structure

```text
react-native-project/
│
├── assets/
├── components/
│   └── TaskCard.tsx
│
├── context/
│   └── TaskContext.tsx
│
├── navigation/
│   └── AppNavigator.tsx
│
├── screens/
│   ├── HomeScreen.tsx
│   ├── ExploreScreen.tsx
│   ├── DetailsScreen.tsx
│   ├── AddTaskScreen.tsx
│   └── auth/
│       ├── LoginScreen.tsx
│       ├── SignupScreen.tsx
│       └── ForgotPasswordScreen.tsx
│
├── services/
│   └── api.js
│
├── App.tsx
├── package.json
└── tsconfig.json
```

## 📂 Backend Structure

```text
taskflowbackend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Tasks.js
│   │   └── user.js
│   │
│   ├── routes/
│   │   └── taskroutes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

> `.env` contains private configuration such as the MongoDB connection string and should never be committed to GitHub.

## 🔄 Task CRUD Flow

TaskFlow communicates with the backend through REST APIs.

```text
Create Task
    ↓
React Native App
    ↓
Axios API Request
    ↓
Express Route
    ↓
Mongoose
    ↓
MongoDB Atlas
    ↓
API Response
    ↓
TaskFlow UI
```

The same architecture is used for retrieving, updating, and deleting tasks.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git
- Expo development environment
- Android Studio or a physical Android device
- MongoDB Atlas account

---

# Frontend Setup

### 1. Clone the frontend repository

```bash
git clone https://github.com/maazmaqbool106-creator/taskflow.git
cd taskflow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL

Create a local environment file if your project uses environment variables:

```text
.env
```

Add your backend API URL according to your local/network configuration.

**Do not commit this file to GitHub.**

### 4. Start Expo

```bash
npx expo start
```

You can then run the application using an Android emulator or a connected physical device.

---

# Backend Setup

### 1. Clone the backend repository

Open another terminal:

```bash
git clone https://github.com/maazmaqbool106-creator/taskflowbackend.git
cd taskflowbackend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Create a `.env` file in the backend root directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Replace the MongoDB connection string with your own MongoDB Atlas connection string.

### 4. Start the backend

```bash
npm start
```

If your project uses nodemon during development:

```bash
npm run dev
```

The backend will run on the configured port, for example:

```text
http://localhost:5000
```

## 🔒 Security

Sensitive configuration should remain outside the repository.

The following files should not be committed:

```text
.env
node_modules/
```

Never expose:

- MongoDB passwords
- Database connection strings
- API secrets
- Authentication secrets

Use environment variables for private configuration.

## 🧪 API Testing

Backend APIs were tested during development using **Postman**.

Example task operations include:

```text
POST    /api/tasks
GET     /api/tasks
PUT     /api/tasks/:id
DELETE  /api/tasks/:id
```

Actual routes may vary depending on the backend implementation.

## 📸 Screenshots

Add screenshots of the completed application here.

Recommended screenshots:

- Login screen
- Signup screen
- Home dashboard
- Task creation screen
- Task details screen
- Categories screen
- Dark-mode interface

Example:

```text
screenshots/
├── login.png
├── home.png
├── add-task.png
├── details.png
└── categories.png
```

## 📚 What I Learned

Building TaskFlow helped me gain practical experience with:

- React Native mobile application development
- Expo development workflow
- TypeScript
- React Navigation
- REST API integration
- Axios
- Node.js and Express.js
- MongoDB Atlas
- Mongoose
- CRUD operations
- Authentication flow
- API testing with Postman
- Git and GitHub
- Frontend-backend integration
- Debugging mobile and backend issues

## 🔮 Future Improvements

Planned improvements include:

- Push notifications
- Recurring tasks
- Sub-task support
- Productivity analytics
- Cloud synchronization
- Improved authentication and password recovery
- Additional UI/UX improvements

## 🔗 Repositories

### Frontend

https://github.com/maazmaqbool106-creator/taskflow

### Backend

https://github.com/maazmaqbool106-creator/taskflowbackend

## 👨‍💻 Author

**Maaz Ur Rehman**

Computer Science Student | React Native | Node.js | MongoDB

---

⭐ If you find this project useful, feel free to explore the repositories and provide feedback.

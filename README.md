<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=MedAI+Logo" alt="MedAI Logo" width="120" />
  <h1>MedAI</h1>
  <p><strong>AI-Powered Medical Report Analysis & Health Tracking Dashboard</strong></p>

  ![MERN Stack](https://img.shields.io/badge/Stack-MERN-38B2AC?style=for-the-badge&logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

  <p>
    <a href="#project-overview">Overview</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation-guide">Installation</a> •
    <a href="#api-endpoints-overview">API</a> •
    <a href="#screenshots">Screenshots</a>
  </p>
</div>

---

## Project Overview

**MedAI** is a comprehensive, AI-driven healthcare dashboard designed to empower patients by demystifying complex medical reports. By leveraging the advanced reasoning capabilities of Google Gemini 2.5, MedAI ingests raw medical test results and transforms them into accessible, easily understandable insights.

### The Problem It Solves
Medical diagnostic reports (like CBC, Lipid Profiles, and Thyroid tests) are typically filled with dense jargon, complex reference ranges, and abbreviations that leave patients confused and anxious. Patients often resort to Googling individual metrics, leading to misinformation and panic.

### Key Benefits
- **Clarity & Comfort:** Translates complex medical jargon into simple, patient-friendly language.
- **Proactive Health Tracking:** Visualizes long-term health trends across multiple tests.
- **Family Management:** Allows users to track and manage the health records of entire families under a single account.
- **Accessibility:** Breaks language barriers with native multi-language support.

---

## Features

- 📄 **Medical Report Analysis**: Upload PDF diagnostic reports to automatically extract and analyze lab values.
- 🩸 **Blood Report Interpretation**: Provides color-coded status indicators (Normal, Borderline, Critical) alongside AI-generated contextual explanations.
- 🌐 **Multi-Language Support**: Automatically translates medical insights and interactive tooltips into English, Hindi, Japanese, and more.
- 📈 **Trend Analysis**: Visualizes historical health markers (Cholesterol, Glucose, Hemoglobin, etc.) over time to predict future outcomes using Recharts.
- 👨‍👩‍👧‍👦 **Family/Patient Management**: Add and manage profiles for various family members to keep their records isolated but accessible.
- 🔐 **Authentication**: Secure JWT-based user login and registration system.
- 📊 **Interactive Dashboard**: A sleek, dark-themed responsive UI summarizing your latest health metrics, lifestyle impact, and AI predictions.
- 💬 **Smart Tooltips**: Viewport-aware, edge-shifting UI tooltips providing instant reference ranges and contextual explanations on hover.

*(Note: MedAI strictly analyzes uploaded diagnostic reports and does not currently feature a real-time conversational chatbot or direct symptom-checker.)*

---

## Tech Stack

### Frontend
- **React.js (v19)** with **Vite** for blazing-fast builds.
- **Tailwind CSS (v4)** for highly responsive, utility-first styling.
- **Framer Motion** for fluid animations and page transitions.
- **Recharts** for rendering rich, interactive data trend graphs.
- **Floating UI** for robust, viewport-aware tooltips.
- **Lucide React** for crisp, scalable iconography.

### Backend
- **Node.js** & **Express.js** for robust API routing.
- **MongoDB** & **Mongoose** for flexible schema-based database management.
- **Google Gemini AI (`@google/genai`)** for intelligent OCR data extraction and medical interpretation.
- **Multer** & **PDF-Parse** for robust file handling and text extraction.
- **JWT (JSON Web Tokens)** & **Bcrypt** for secure authentication and password hashing.

---

## Architecture Overview

MedAI follows a standard client-server architecture decoupled via RESTful APIs:
1. **Client Layer:** A React SPA that handles UI state, data visualization, and file uploads.
2. **API Gateway (Express):** Receives user requests, authenticates them via JWT middleware, and routes them to respective services.
3. **AI Service Layer:** The backend securely transmits extracted report data to Google Gemini to structure the text into standardized JSON lab values, generating multilingual insights.
4. **Data Persistence:** User profiles, family members, and analyzed report histories are stored securely in MongoDB Atlas.

---

## Folder Structure

```text
MedAI/
├── client/                     # Frontend React Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Tooltips, Cards, etc.)
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # Main route views (Dashboard, Trends, Family, etc.)
│   │   └── services/           # Axios API configuration
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                     # Backend Node/Express Application
│   ├── config/                 # Database configuration
│   ├── middleware/             # Auth and file upload middlewares
│   ├── models/                 # Mongoose database schemas (User, Report, Family)
│   ├── routes/                 # Express route definitions (auth.js, reports.js)
│   ├── services/               # Core business logic (aiService.js)
│   ├── index.js                # Server entry point
│   └── package.json
│
├── .gitignore                  # Global git ignore rules
├── .env.example                # Environment variables template
└── README.md                   # Project documentation
```

---

## Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/mayank4574/MedAi.git
cd MedAi
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## Environment Variables

Create a `.env` file in the `server` directory (you can copy `.env.example` as a starting point). 

```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# AI Integration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# CORS
CLIENT_URL=http://localhost:5173
```

---

## Local Development Setup

Open two terminal instances to run the frontend and backend concurrently.

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
```
*The backend will start on `http://localhost:5000`.*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

---

## API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /register` - Register a new user account.
- `POST /login` - Authenticate user and receive JWT.
- `GET /me` - Retrieve current user profile.
- `POST /family` - Add a new family member to user's account.
- `GET /family` - Retrieve user's family members.

### Reports (`/api/reports`)
- `POST /upload` - Upload a PDF report (multipart/form-data). Extracts text, calls Gemini AI, and saves the structured analysis.
- `GET /` - Get all past analyzed reports for the user.
- `GET /:id` - Get specific report analysis details.
- `DELETE /:id` - Remove a report from history.

---

## Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Dashboard+View" alt="Dashboard" />
  <br/><em>Interactive Dashboard Overview</em><br/><br/>
  
  <img src="https://via.placeholder.com/800x450.png?text=Report+Analysis+View" alt="Report Analysis" />
  <br/><em>Detailed Medical Report Analysis with Floating Tooltips</em><br/><br/>
  
  <img src="https://via.placeholder.com/800x450.png?text=Trend+Analysis+Graphs" alt="Trends" />
  <br/><em>Health Trend Visualization over time</em>
</div>

---

## Future Improvements
- **Direct EHR Integration:** Connect directly to hospital APIs to pull electronic health records automatically.
- **Wearable Device Sync:** Integrate with Apple Health / Google Fit for continuous real-time data tracking.
- **Export to PDF:** Allow users to download the simplified AI report as a highly readable PDF to share with loved ones.
- **Symptom Checker:** Implement an interactive symptom assessment module.

---

## Medical Disclaimer
> **⚠️ IMPORTANT:** MedAI is designed for informational and educational purposes only. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or diagnostic report. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.

---

## Author

**Mayank**  
- GitHub: [@mayank4574](https://github.com/mayank4574)

---

## License

This project is licensed under the [MIT License](LICENSE).

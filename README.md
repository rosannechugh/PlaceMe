# Placement Drive Management System

A full-stack web application to automate and streamline the college placement process. It enables students to apply for placement drives and allows administrators to manage companies, drives, and applications efficiently.

---

## 🌟 Features

### 👨‍🎓 Student Module
- Register & Login  
- View available placement drives  
- Apply for drives  
- Upload resume (PDF only, max 2MB)  
- Track application status  

### 👨‍💼 Admin Module
- Add companies  
- Create placement drives  
- Define eligibility criteria (CGPA, branch)  
- View student applications  
- View/download resumes  

---

## 🛠️ Technologies Used

### Frontend
- React (Vite)  
- TypeScript  
- Tailwind CSS  
- ShadCN UI  

### Backend
- Flask (Python)  

### Database
- SQLite  

### Deployment
- Backend: Render  
- Frontend: Vercel  
- Version Control: GitHub  

---

## 🌐 Live Demo

- Frontend: https://your-vercel-url.vercel.app  
- Backend API: https://placeme-nalv.onrender.com  

---

## ⚙️ Setup Instructions

### Clone the Repository
```bash
git clone <your-repo-url>
cd placement-system
```

---

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs on:
```
http://localhost:5000
```

---

### Frontend Setup
```bash
cd frontend/placement-drive-management
npm install
npm run dev
```

---

## 🔐 Configuration

Make sure your frontend uses the deployed backend:

```javascript
const API_URL = "https://placeme-nalv.onrender.com";
```

---

## 📂 Project Structure

```
placement-system/
│
├── backend/
│   ├── app.py
│   ├── database.db
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   └── placement-drive-management/
│       ├── src/
│       └── package.json
```

---

## 📄 Resume Upload Feature

- Only PDF files allowed  
- Maximum file size: 2MB  
- Stored on server  
- Accessible to admin  

---

## 👩‍💻 Team Contributions

### Rosanne Chugh
- Backend development (Flask APIs, authentication)
- Resume upload feature
- Deployment on Render
- Integration of frontend and backend

### Rajapurohitham Sahana
- Frontend development
- UI design and responsiveness
- Dashboard implementation

### Yuvika Das
- Database design
- Testing and validation

---

## Future Enhancements

- Resume preview before upload  
- Email notifications  
- JWT-based authentication  
- Cloud storage (AWS S3 / Firebase)  
- Advanced filtering and analytics  

---

## 📜 License

This project is developed for educational purposes.

---

⭐ If you like this project, consider giving it a star!

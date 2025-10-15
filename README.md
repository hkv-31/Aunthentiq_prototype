# 🧩 AuthentIQ Prototype

AuthentIQ is a two-mode prototype designed to simplify **product return management** for small online sellers.  
It allows sellers to customize their store’s branding and monitor return analytics while providing customers with a seamless way to initiate and track return requests.

## 🚀 Background

Many small e-commerce sellers struggle to manage product returns efficiently, especially when selling across multiple platforms.  
AuthentIQ bridges that gap by offering a **unified return management interface**, featuring:

- A **Seller Mode** for dashboard insights, product management, and return tracking.  
- A **Customer Mode** that mirrors the seller’s branding and enables easy return form submissions.

This prototype demonstrates the **core logic, data flow, and user interface** for such a system.

## ⚙️ Installation & Setup

### 🐍 Backend Setup (Python)

1. Navigate to the backend folder:
   cd aunthentiq/backend
2. (Optional but recommended) Create a virtual environment
3. Install dependencies:
   pip install -r requirements.txt
4. Run the backend server:
   python app.py
5. The backend API should now be running at:
   http://localhost:5000

### ⚛️ Frontend Setup (React)
1. Navigate to the frontend folder:
   cd ../frontend
2. Install dependencies:
   npm install
3. Start the development server:
   npm start
4. The frontend will be live at:
   http://localhost:3000

## 🧩 Features
**Seller Mode-** 
1. Manage store branding (logo, colors, Instagram handle)
2. Add and track products
3. View dashboard analytics (total orders, returns, and top-returned items)
4. Manage return requests with photo evidence and reasons

**Customer Mode-**
1. View the seller’s customized storefront
2. Submit product return requests easily
3. Upload photos and describe return reasons

## 📊 Tech Stack
Frontend: React, JavaScript, Tailwind CSS
Backend: Python (Flask or FastAPI), JSON-based storage
Data: Local JSON mock data (no external database required for prototype)

# 📦 SwiftDrop - Parcel Delivery Tracker

SwiftDrop is a full-stack parcel delivery and tracking platform. It simplifies logistics for Senders, Agents, and Admins. Users can send parcels, track delivery progress, update statuses, and manage operations securely.

---

## 🌐 Live Demo  
Frontend: **[https://swiftdrop-1.onrender.com/](https://swiftdrop-1.onrender.com/)**  
Base API URL: **[https://swiftdrop-xh7v.onrender.com](https://swiftdrop-xh7v.onrender.com)**  
API Docs (Debug): `/__debug__/routes`  
Health Check:
```bash
curl https://swiftdrop-xh7v.onrender.com/health
📁 Project Structure
bash
Copy
Edit
.
├── backend/
│   ├── app/
│   │   ├── models/           # SQLAlchemy models (User, Parcel, etc.)
│   │   ├── schemas/          # Marshmallow schemas for validation
│   │   ├── resources/        # API route handlers (Flask-RESTful)
│   │   ├── utils/            # JWT, role-based access decorators
│   │   ├── extensions.py     # App extensions (db, jwt, ma, migrate)
│   │   └── __init__.py       # Application factory
│   ├── run.py                # Entry point
│   ├── requirements.txt
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   └── auth/
    ├── public/
    ├── tailwind.config.js
    └── vite.config.js
🧰 Tech Stack
🖥 Backend (Flask)
Flask, Flask-RESTful

Flask-JWT-Extended (Auth)

SQLAlchemy + Marshmallow

Flask-Migrate

PostgreSQL (Cloud)

🎨 Frontend (React + Tailwind)
React 18 + Vite

React Router

Tailwind CSS

Axios

🚀 Deployment
Render (Frontend + Backend)

PostgreSQL on Render

🔐 Authentication & Roles
Role	Description
Admin	Manages users, assigns agents, oversees system metrics
Sender	Creates and tracks parcels
Agent	Updates delivery status of assigned parcels

🔀 Key API Endpoints
✅ Public
POST /auth/register – Register

POST /auth/login – Login and receive JWT

🔵 Admin Only
GET /admin/users

PUT /admin/users/:id

POST /admin/assign

GET /admin/metrics

DELETE /parcels/:id/tracking

POST /tags

🟠 Sender
POST /parcels – Create new parcel

🟡 Agent
GET /agent/deliveries

PUT /agent/deliveries/:id

POST /parcels/:id/tracking

🟣 All Authenticated Users
GET /parcels

GET /parcels/:id

GET /parcels/:id/tracking

PUT /parcels/:id (admin only)

GET /tags

🧪 Sample curl Usage
bash
Copy
Edit
# Create a parcel (as sender)
curl -X POST https://swiftdrop-xh7v.onrender.com/parcels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Phone", "sender_id": 1}'
🧪 Testing Tips
Use Postman or curl to test

Login with different roles

Confirm:

🔐 JWT protection is active

✅ Role-based access control

🔄 Clear error messages

🔧 .env Example
env
Copy
Edit
FLASK_APP=run.py
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:5432/dbname?options=-csearch_path=swiftdrop_schema
JWT_SECRET_KEY=your-secret-key
📌 Future Enhancements
🔁 Password reset endpoint

📜 Pagination for parcels

📘 Swagger/ReDoc API documentation

🧪 Unit tests with Pytest

👩🏽‍💻 Developer
Evelyne Joseph
Edwin Mammet
# 🚚 SwiftDrop - Parcel Delivery API (Flask)

**SwiftDrop** is a backend system for managing parcel deliveries, built with **Flask** and following a RESTful architecture.

## ✅ Features

- User registration & authentication  
- Admin management  
- Agent delivery updates  
- Parcel tracking  

---

## 🚀 Live Deployment

- 🌐 **Base URL:** https://swiftdrop-xh7v.onrender.com  
- 📜 **API Docs (Flask Debug):** `/__debug__/routes`  
- ❤️ **Health Check:**

```bash
curl https://swiftdrop-xh7v.onrender.com/health
📁 Project Structure
bash
Copy
Edit
backend/
├── app/
│   ├── models/           # SQLAlchemy models (User, Parcel, etc.)
│   ├── schemas/          # Marshmallow schemas
│   ├── resources/        # Flask-RESTful route handlers
│   ├── utils/            # JWT + Role decorators
│   ├── extensions.py     # Extensions (db, jwt, ma, migrate)
│   └── __init__.py       # App factory + route registration
├── run.py                # App entry point
├── requirements.txt      # All dependencies
├── .env                  # Environment variables
🧰 Tech Stack
Python 3.12

Flask & Flask-RESTful

Flask-JWT-Extended

Flask-SQLAlchemy

Flask-Migrate

Flask-Marshmallow

PostgreSQL

Render (Deployment)

🔐 Authentication
Register
http
Copy
Edit
POST /auth/register
Payload:

json
Copy
Edit
{
  "username": "admin1",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "admin"
}
Login
http
Copy
Edit
POST /auth/login
Payload:

json
Copy
Edit
{
  "email": "admin@example.com",
  "password": "adminpass"
}
Response:

json
Copy
Edit
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
🔓 Roles & Capabilities
Admin: Manage users, assign agents, view delivery metrics

Sender: Create and track parcels

Agent: Update delivery status, view assigned deliveries

🔀 API Endpoints
🟢 Public
POST /auth/register — Register a new user

POST /auth/login — Login and receive a JWT token

🔵 Admin Only
GET /admin/users — View all registered users

PUT /admin/users/<user_id> — Update user role

POST /admin/assign — Assign agent to a parcel

GET /admin/metrics — View parcel delivery statistics

DELETE /parcels/<id>/tracking — Delete all tracking logs for a parcel

GET /tracking-logs — View all tracking logs

POST /tags — Create a new tag

🟠 Sender
POST /parcels — Create a new parcel

🟡 Agent
GET /agent/deliveries — View assigned parcels

PUT /agent/deliveries/<parcel_id> — Update delivery status

POST /parcels/<id>/tracking — Add a tracking log

🟣 General Access (All Roles)
GET /parcels — List all parcels

GET /parcels/<id> — Get parcel details

GET /parcels/<id>/tracking — View tracking logs

PUT /parcels/<id> — Update parcel (admin only)

GET /tags — List all tags

🧪 Example Request (with curl)
Create a Parcel (as sender)
bash
Copy
Edit
curl -X POST https://swiftdrop-xh7v.onrender.com/parcels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Phone", "sender_id": 1}'
🧪 Testing Checklist
✅ Test with Postman or curl

✅ Use test users with different roles

✅ Confirm:

JWT protection works

Admin-only/Agent-only routes are protected

Clear error messages for bad requests

✅ Deployment Notes
Platform: Render

Database: PostgreSQL (cloud-hosted)

.env Example
env
Copy
Edit
FLASK_APP=run.py
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:5432/dbname?options=-csearch_path=swiftdrop_schema
JWT_SECRET_KEY=your-secret
📌 Future Enhancements
Add /auth/reset-password endpoint

Add pagination for parcels list

Add Swagger/ReDoc API documentation

Write unit tests using pytest

👨‍💻 Developer
Evelyne Joseph
🚀 Software Developer | Django | Flask | APIs | PostgreSQL
📧 evelynejose1993@gmail.com
🔗 GitHub: Eve-code93
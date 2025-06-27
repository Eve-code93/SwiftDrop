
# 🚚 SwiftDrop — Parcel Delivery API (Flask)

SwiftDrop is a backend REST API for managing parcel deliveries. It enables user registration, authentication, agent tracking, parcel creation, and admin-level operations. Built with **Flask**, it follows a modular structure and secure authentication using JWT.

---

## 🚀 Live Deployment

- **🌐 Base URL:** [https://swiftdrop-xh7v.onrender.com](https://swiftdrop-xh7v.onrender.com)
- **📜 API Docs (Debug Route):** `/__debug__/routes`
- **❤️ Health Check:**

```bash
curl https://swiftdrop-xh7v.onrender.com/health
📁 Project Structure
backend/
├── app/
│   ├── models/           # SQLAlchemy models (User, Parcel, etc.)
│   ├── schemas/          # Marshmallow schemas for validation
│   ├── resources/        # API route handlers (Flask-RESTful)
│   ├── utils/            # JWT, role-based access decorators
│   ├── extensions.py     # App extensions (db, jwt, ma, migrate)
│   └── __init__.py       # Application factory
├── run.py                # Entry point
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
🧰 Tech Stack
Python 3.12

Flask

Flask-RESTful

Flask-JWT-Extended

Flask-SQLAlchemy

Flask-Migrate

Flask-Marshmallow

PostgreSQL

Render (for deployment)

🔐 Authentication & Roles
Register
POST /auth/register
{
Request Body:
  "username": "admin1",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "admin"
}
Login
POST /auth/login
Request Body:
{
  "email": "admin@example.com",
  "password": "adminpass"
}
Response:
{
  "access_token": "your.jwt.token"
}
🔓 Roles
Role	Description
Admin	Manage users, assign agents, view system metrics
Sender	Create and track parcels
Agent	Update delivery status, view assigned parcels

🔀 API Endpoints
🟢 Public
POST /auth/register — Register a new user

POST /auth/login — Login and receive JWT token

🔵 Admin Only
GET /admin/users — View all users

PUT /admin/users/<user_id> — Update a user’s role

POST /admin/assign — Assign agent to a parcel

GET /admin/metrics — View parcel delivery statistics

DELETE /parcels/<id>/tracking — Delete all tracking logs

POST /tags — Create a new tag

GET /tracking-logs — View all tracking logs

🟠 Sender
POST /parcels — Create a new parcel

🟡 Agent
GET /agent/deliveries — View assigned deliveries

PUT /agent/deliveries/<parcel_id> — Update delivery status

POST /parcels/<id>/tracking — Add a tracking log

🟣 All Authenticated Users
GET /parcels — List all parcels

GET /parcels/<id> — View parcel details

GET /parcels/<id>/tracking — View tracking logs

PUT /parcels/<id> — Update parcel (admin only)

GET /tags — List tags
🧪 Example Usage with curl
Create a Parcel (as Sender)
curl -X POST https://swiftdrop-xh7v.onrender.com/parcels \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description": "Phone", "sender_id": 1}'
🧪 Testing Tips
Use Postman or curl to test endpoints

Log in as different roles (admin, sender, agent)

Confirm:

JWT token protection is enforced

Role-based access control works

Errors return clear, informative messages
✅ Deployment Notes
Platform: Render

Database: PostgreSQL (cloud-hosted)

.env Example
FLASK_APP=run.py
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:5432/dbname?options=-csearch_path=swiftdrop_schema
JWT_SECRET_KEY=your-secret-key
📌 Future Enhancements
Add /auth/reset-password endpoint

Implement pagination for parcel listings

Generate Swagger or ReDoc API documentation

Add unit tests using pytest

👩🏽‍💻 Developer
Evelyne Joseph
🚀 Software Developer — Django | Flask | API | PostgreSQL
📧 evelynejose1993@gmail.com
🔗 GitHub: Eve-code93

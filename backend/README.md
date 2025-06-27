
markdown
Copy
Edit
# 🚚 SwiftDrop - Parcel Delivery API (Flask)

SwiftDrop is a backend system for managing parcel deliveries, built with **Flask** and following a RESTful architecture. It supports:

- ✅ User registration & authentication  
- ✅ Admin management  
- ✅ Agent delivery updates  
- ✅ Parcel tracking  

---

## 🚀 Live Deployment

- **🌐 Base URL:** [https://swiftdrop-xh7v.onrender.com](https://swiftdrop-xh7v.onrender.com)  
- **📜 API Docs (Flask Debug Routes):** `/__debug__/routes`  
- **❤️ Health Check:**  
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

Flask

Flask-RESTful

Flask-JWT-Extended

Flask-SQLAlchemy

Flask-Migrate

Flask-Marshmallow

PostgreSQL

Render (Deployment)

🔐 Authentication
🔸 Register
http
Copy
Edit
POST /auth/register
Content-Type: application/json

{
  "username": "admin1",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "admin"
}
🔸 Login
http
Copy
Edit
POST /auth/login
Content-Type: application/json

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
🔓 User Roles
Role	Permissions
admin	Manage users, assign agents, view metrics
sender	Create and track parcels
agent	Update parcel status and tracking logs

🔀 API Endpoints Overview
Role	Method	Endpoint	Description
Public	POST	/auth/register	Register a new user
Public	POST	/auth/login	Login & get JWT token
Admin	GET	/admin/users	View all users
Admin	PUT	/admin/users/<user_id>	Update user role
Admin	POST	/admin/assign	Assign agent to parcel
Admin	GET	/admin/metrics	View delivery stats
Sender	POST	/parcels	Create a new parcel
All	GET	/parcels	List all parcels
All	GET	/parcels/<id>	View parcel details
Admin	PUT	/parcels/<id>	Update parcel
All	GET	/parcels/<id>/tracking	View parcel tracking logs
Agent	POST	/parcels/<id>/tracking	Add tracking log
Admin	DELETE	/parcels/<id>/tracking	Delete all tracking logs
Agent	GET	/agent/deliveries	View assigned parcels
Agent	PUT	/agent/deliveries/<parcel_id>	Update delivery status
All	GET	/tags	List tags
Admin	POST	/tags	Create new tag
Admin	GET	/tracking-logs	View all logs (admin only)

🔧 Example Usage with curl
✅ Create Parcel (as sender)
bash
Copy
Edit
curl -X POST https://swiftdrop-xh7v.onrender.com/parcels \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"description": "Phone", "sender_id": 1}'
🧪 Testing Suggestions
Test all endpoints using Postman or curl

Use sample users with different roles

Validate:

JWT-based authentication

Role-based access (admin-only, agent-only)

Proper error handling and messages

✅ Deployment Notes
Platform: Render

Database: PostgreSQL (Cloud)

📄 .env Example
env
Copy
Edit
FLASK_APP=run.py
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:5432/dbname?options=-csearch_path=swiftdrop_schema
JWT_SECRET_KEY=your-secret
📌 Future Improvements
Add /auth/reset-password

Implement pagination for parcels

Generate Swagger/ReDoc API docs

Add unit tests using pytest

👨‍💻 Developer
Evelyne Joseph
🚀 Software Developer | Django | Flask | API | PostgreSQL
📧 evelynejose1993@gmail.com
🔗 GitHub: Eve-code93
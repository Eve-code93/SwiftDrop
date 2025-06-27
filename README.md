
SwiftDrop is a parcel delivery backend system built with Flask, providing endpoints for:

User registration & authentication

Admin management

Agent delivery updates

Parcel tracking

🚀 Live Deployment
🌐 Base URL: https://swiftdrop-xh7v.onrender.com

📜 API Docs (routes): /__debug__/routes

❤️ Health Check:

bash
curl https://swiftdrop-xh7v.onrender.com/health


## 📁 Project Structure

```bash
backend/
├── app/
│   ├── models/           # SQLAlchemy models (User, Parcel, etc.)
│   ├── schemas/          # Marshmallow schemas
│   ├── resources/        # Flask-RESTful route handlers
│   ├── utils/            # JWT + Role decorators
│   ├── extensions.py     # Extensions (db, jwt, ma, migrate)
│   └── __init__.py       # App factory + route registration
├── run.py                # App entry point
├── requirements.txt      # Project dependencies
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

Render for Deployment

🔐 Authentication
🔸 Register
http
Copy
Edit
POST /auth/register
json
Copy
Edit
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
json
Copy
Edit
{
  "email": "admin@example.com",
  "password": "adminpass"
}
Returns:

json
Copy
Edit
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
}
🔓 Roles
admin: Manage users, assign agents, see metrics

sender: Create/view parcels

agent: Update delivery status and tracking logs

🔀 API Endpoints Overview
Role	Method	Endpoint	Description
Public	POST	/auth/register	Register new user
Public	POST	/auth/login	Login & get token
Admin	GET	/admin/users	View all users
Admin	PUT	/admin/users/<user_id>	Update user role
Admin	POST	/admin/assign	Assign agent to parcel
Admin	GET	/admin/metrics	View parcel delivery stats
Sender	POST	/parcels	Create a new parcel
All	GET	/parcels	List all parcels
All	GET	/parcels/<id>	Parcel details
Admin	PUT	/parcels/<id>	Update parcel
All	GET	/parcels/<id>/tracking	Parcel tracking logs
Agent	POST	/parcels/<id>/tracking	Add tracking log
Admin	DELETE	/parcels/<id>/tracking	Delete all logs
Agent	GET	/agent/deliveries	View assigned parcels
Agent	PUT	/agent/deliveries/<parcel_id>	Update delivery status
All	GET	/tags	List tags
Admin	POST	/tags	Create new tag
Admin	GET	/tracking-logs	View all logs (admin only)

🔧 Example with curl
✅ Create Parcel (as sender)
bash
Copy
Edit
curl -X POST https://swiftdrop-xh7v.onrender.com/parcels \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"description": "Phone", "sender_id": 1}'
🧪 Testing Suggestions
Test all routes with Postman or curl

Use sample users for different roles

Validate:

JWT protection works

Admin-only/Agent-only routes are secure

Proper error messages on bad input

✅ Deployment Notes
Platform: Render

DB: PostgreSQL (Cloud)

.env should contain:

env
Copy
Edit
FLASK_APP=run.py
SQLALCHEMY_DATABASE_URI=postgresql://user:password@host:5432/dbname?options=-csearch_path=swiftdrop_schema
JWT_SECRET_KEY=your-secret
📌 Future Improvements
Add /auth/reset-password

Paginate parcels

Swagger or ReDoc API docs

Write unit tests with pytest

👨‍💻 Developer
Evelyne Joseph
🚀 Software Developer | Django | Flask | API | PostgreSQL
📧 evelynejose1993@gmail.com
🔗 GitHub: Eve-code93

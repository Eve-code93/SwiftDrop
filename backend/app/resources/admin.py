from flask import request, jsonify
from flask_restful import Resource
from app.models.user import User
from app.models.parcel import Parcel
from app.extensions import db
from app.utils.decorators import role_required

class UserListResource(Resource):
    @role_required("admin")
    def get(self):
        users = User.query.all()
        return [{"id": u.id, "email": u.email, "role": u.role} for u in users], 200


class UserRoleUpdateResource(Resource):
    @role_required("admin")
    def put(self, user_id):
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        user.role = data.get("role", user.role)
        db.session.commit()
        return {"message": "User role updated", "user": {"id": user.id, "role": user.role}}, 200


class AssignAgentResource(Resource):
    @role_required("admin")
    def post(self):
        data = request.get_json()
        parcel = Parcel.query.get_or_404(data["parcel_id"])
        agent = User.query.get_or_404(data["agent_id"])

        if agent.role != "agent":
            return {"message": "Selected user is not an agent"}, 400

        parcel.agent_id = agent.id
        db.session.commit()
        return {"message": f"Agent {agent.email} assigned to Parcel {parcel.id}"}, 200

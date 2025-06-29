from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from datetime import timedelta

from app import db
from app.models.user import User
from app.schemas.user_schema import UserSchema

user_schema = UserSchema()

class Register(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(email=data['email']).first():
            return {"message": "User already exists."}, 400

        user = User(
            username=data["username"],
            email=data["email"],
            role=data.get("role", "user")
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        return user_schema.dump(user), 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data["email"]).first()

        if user and user.check_password(data["password"]):
            access_token = create_access_token(
                identity=str(user.id),  # ensure identity is a string
                additional_claims={"role": user.role},
                expires_delta=timedelta(hours=2)
            )
            return {"access_token": access_token}, 200

        return {"message": "Invalid credentials"}, 401

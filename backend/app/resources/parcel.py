from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.parcel import Parcel
from app.models.user import User
from app.extensions import db
from app.schemas.parcel import ParcelSchema
from app.utils.decorators import role_required

parcel_schema = ParcelSchema()
parcels_schema = ParcelSchema(many=True)

class ParcelListResource(Resource):
    @jwt_required()
    def get(self):
        user = User.query.get(get_jwt_identity())
        if user.role == 'admin':
            parcels = Parcel.query.all()
        else:
            parcels = Parcel.query.filter_by(sender_id=user.id).all()
        return parcels_schema.dump(parcels), 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        parcel = Parcel(
            description=data["description"],
            sender_id=user_id,
            receiver_id=data.get("receiver_id"),
            status=data.get("status", "pending")
        )
        db.session.add(parcel)
        db.session.commit()
        return parcel_schema.dump(parcel), 201


class ParcelResource(Resource):
    @jwt_required()
    def get(self, parcel_id):
        user = User.query.get(get_jwt_identity())
        parcel = Parcel.query.get_or_404(parcel_id)
        if user.role != 'admin' and parcel.sender_id != user.id:
            return {"message": "Access denied"}, 403
        return parcel_schema.dump(parcel), 200

    @role_required("admin")
    def delete(self, parcel_id):
        parcel = Parcel.query.get_or_404(parcel_id)
        db.session.delete(parcel)
        db.session.commit()
        return {"message": "Parcel deleted"}, 204

    @jwt_required()
    @role_required("admin")
    def put(self, parcel_id):
        parcel = Parcel.query.get_or_404(parcel_id)
        data = request.get_json()
        
        parcel.description = data.get("description", parcel.description)
        parcel.status = data.get("status", parcel.status)
        parcel.receiver_id = data.get("receiver_id", parcel.receiver_id)

        db.session.commit()
        return parcel_schema.dump(parcel), 200
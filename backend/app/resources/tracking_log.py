# app/resources/tracking_log.py

from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.tracking_log import TrackingLog
from app.models.parcel import Parcel
from app.models.user import User
from app.schemas.tracking_log import TrackingLogSchema
from app.extensions import db
from app.utils.decorators import role_required, agent_required

tracking_log_schema = TrackingLogSchema()
tracking_logs_schema = TrackingLogSchema(many=True)


# ✅ For admin or debugging: view all logs
class TrackingLogListResource(Resource):
    @jwt_required()
    @role_required("admin")
    def get(self):
        logs = TrackingLog.query.all()
        return tracking_logs_schema.dump(logs), 200


# ✅ For individual parcel logs
class ParcelTrackingResource(Resource):
    @jwt_required()
    def get(self, parcel_id):
        user = User.query.get(get_jwt_identity())
        parcel = Parcel.query.get_or_404(parcel_id)

        # Allow admin or parcel sender
        if user.role != 'admin' and parcel.sender_id != user.id:
            return {"message": "Access denied"}, 403

        logs = TrackingLog.query.filter_by(parcel_id=parcel_id).all()
        return tracking_logs_schema.dump(logs), 200

    @jwt_required()
    @agent_required
    def post(self, parcel_id):
        data = request.get_json()
        new_log = TrackingLog(
            parcel_id=parcel_id,
            status=data.get("status"),
            location=data.get("location")
        )
        db.session.add(new_log)
        db.session.commit()
        return tracking_log_schema.dump(new_log), 201

    @jwt_required()
    @role_required("admin")
    def delete(self, parcel_id):
        logs = TrackingLog.query.filter_by(parcel_id=parcel_id).all()
        for log in logs:
            db.session.delete(log)
        db.session.commit()
        return {"message": "All tracking logs deleted"}, 204

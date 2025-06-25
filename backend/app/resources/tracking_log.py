from flask_restful import Resource, reqparse
from flask import request
from app import db
from app.models.tracking_log import TrackingLog
from app.schemas.tracking_log import TrackingLogSchema

tracking_log_schema = TrackingLogSchema()
tracking_logs_schema = TrackingLogSchema(many=True)

class TrackingLogListResource(Resource):
    def get(self):
        logs = TrackingLog.query.all()
        return tracking_logs_schema.dump(logs), 200

    def post(self):
        data = request.get_json()
        new_log = TrackingLog(
            parcel_id=data.get("parcel_id"),
            status=data.get("status"),
            location=data.get("location")
        )
        db.session.add(new_log)
        db.session.commit()
        return tracking_log_schema.dump(new_log), 201

class TrackingLogResource(Resource):
    def get(self, log_id):
        log = TrackingLog.query.get_or_404(log_id)
        return tracking_log_schema.dump(log), 200

    def put(self, log_id):
        log = TrackingLog.query.get_or_404(log_id)
        data = request.get_json()
        log.status = data.get("status", log.status)
        log.location = data.get("location", log.location)
        db.session.commit()
        return tracking_log_schema.dump(log), 200

    def delete(self, log_id):
        log = TrackingLog.query.get_or_404(log_id)
        db.session.delete(log)
        db.session.commit()
        return {'message': 'Deleted'}, 204

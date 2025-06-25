# app/resources/parcel.py

from flask_restful import Resource
from flask import request
from app.models.parcel import Parcel
from app.extensions import db
from app.schemas.parcel import ParcelSchema

parcel_schema = ParcelSchema()
parcels_schema = ParcelSchema(many=True)

class ParcelListResource(Resource):
    def get(self):
        parcels = Parcel.query.all()
        return parcels_schema.dump(parcels), 200

    def post(self):
        data = request.get_json()
        parcel = parcel_schema.load(data, session=db.session)
        db.session.add(parcel)
        db.session.commit()
        return parcel_schema.dump(parcel), 201

class ParcelResource(Resource):
    def get(self, parcel_id):
        parcel = Parcel.query.get_or_404(parcel_id)
        return parcel_schema.dump(parcel)

    def delete(self, parcel_id):
        parcel = Parcel.query.get_or_404(parcel_id)
        db.session.delete(parcel)
        db.session.commit()
        return {"message": "Parcel deleted"}, 204

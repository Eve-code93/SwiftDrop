# app/resources/agent.py

from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.parcel import Parcel
from app.schemas.parcel import ParcelSchema
from flask import request

from app import db
from app.utils.decorators import agent_required

parcel_schema = ParcelSchema()
parcels_schema = ParcelSchema(many=True)

class AgentDeliveryListResource(Resource):
    @jwt_required()
    @agent_required
    def get(self):
        agent_id = get_jwt_identity()
        parcels = Parcel.query.filter_by(agent_id=agent_id).all()
        return parcels_schema.dump(parcels), 200


class AgentDeliveryUpdateResource(Resource):
    @jwt_required()
    @agent_required
    def put(self, parcel_id):
        data = parcel_schema.load(request.get_json(), partial=True)
        parcel = Parcel.query.get_or_404(parcel_id)

        # Ensure the agent is assigned to this parcel
        agent_id = get_jwt_identity()
        if parcel.agent_id != agent_id:
            return {"msg": "Not authorized to update this parcel"}, 403

        # Allow updating delivery status
        parcel.status = data.get('status', parcel.status)
        db.session.commit()
        return parcel_schema.dump(parcel), 200

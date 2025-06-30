from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import joinedload
from marshmallow import ValidationError

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
        """Get parcels: all for admin, assigned for agents, own for regular users."""
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get_or_404(user_id)

            query = Parcel.query.options(
                joinedload(Parcel.sender),
                joinedload(Parcel.agent)
            )

            if user.role == 'admin':
                parcels = query.all()
            elif user.role == 'agent':
                parcels = query.filter(Parcel.agent_id == user.id).all()
            else:
                parcels = query.filter(Parcel.sender_id == user.id).all()

            return parcels_schema.dump(parcels), 200

        except Exception as e:
            return {"message": "Failed to fetch parcels", "error": str(e)}, 500

    @jwt_required()
    def post(self):
        """Create a new parcel (authenticated users only)"""
        try:
            data = request.get_json()
            user_id = int(get_jwt_identity())

            if not data.get('description'):
                return {"message": "Description is required"}, 400
            if not data.get('destination'):
                return {"message": "Destination is required"}, 400

            parcel = Parcel(
                description=data['description'],
                destination=data['destination'],
                sender_id=user_id,
                receiver_id=data.get('receiver_id'),
                status='pending'
            )

            db.session.add(parcel)
            db.session.commit()

            return parcel_schema.dump(parcel), 201

        except ValidationError as e:
            return {"message": "Validation error", "errors": e.messages}, 400
        except SQLAlchemyError as e:
            db.session.rollback()
            return {"message": "Database error", "error": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            return {"message": "Failed to create parcel", "error": str(e)}, 500


class ParcelResource(Resource):
    @jwt_required()
    def get(self, parcel_id):
        """Get specific parcel (admin, sender or assigned agent)"""
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get_or_404(user_id)

            parcel = Parcel.query.options(
                joinedload(Parcel.sender),
                joinedload(Parcel.agent)
            ).get_or_404(parcel_id)

            if user.role != 'admin' and parcel.sender_id != user.id and parcel.agent_id != user.id:
                return {"message": "Access denied"}, 403

            return parcel_schema.dump(parcel), 200

        except Exception as e:
            return {"message": "Failed to fetch parcel", "error": str(e)}, 500

    @jwt_required()
    @role_required("admin")
    def delete(self, parcel_id):
        """Delete parcel (admin only)"""
        try:
            parcel = Parcel.query.get_or_404(parcel_id)
            db.session.delete(parcel)
            db.session.commit()
            return {"message": "Parcel deleted successfully"}, 204

        except SQLAlchemyError as e:
            db.session.rollback()
            return {"message": "Database error", "error": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            return {"message": "Failed to delete parcel", "error": str(e)}, 500

    @jwt_required()
    @role_required("admin")
    def put(self, parcel_id):
        """Update parcel (admin only)"""
        try:
            parcel = Parcel.query.get_or_404(parcel_id)
            data = request.get_json()

            if 'receiver_id' in data:
                if data['receiver_id'] and not User.query.get(data['receiver_id']):
                    return {"message": "Receiver not found"}, 404
                parcel.receiver_id = data['receiver_id']

            if 'agent_id' in data:
                agent = User.query.get(data['agent_id'])
                if not agent or agent.role != 'agent':
                    return {"message": "Agent not found or not an agent"}, 404
                parcel.agent_id = agent.id
                if parcel.status == 'pending':
                    parcel.status = 'assigned'

            if 'description' in data:
                parcel.description = data['description']
            if 'status' in data:
                parcel.status = data['status']
            if 'destination' in data:
                parcel.destination = data['destination']

            db.session.commit()
            return parcel_schema.dump(parcel), 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Failed to update parcel", "error": str(e)}, 500


class AssignParcelResource(Resource):
    @jwt_required()
    @role_required("admin")
    def post(self, parcel_id):
        """Assign parcel to an agent (admin only)"""
        try:
            data = request.get_json()
            if not data.get('agent_id'):
                return {"message": "agent_id is required"}, 400

            parcel = Parcel.query.get_or_404(parcel_id)
            agent = User.query.get_or_404(data['agent_id'])

            if agent.role != 'agent':
                return {"message": "User is not an agent"}, 400

            parcel.agent_id = agent.id
            if parcel.status == 'pending':
                parcel.status = 'assigned'

            db.session.commit()
            return parcel_schema.dump(parcel), 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Failed to assign parcel", "error": str(e)}, 500

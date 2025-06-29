from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
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
        """Get parcels (all for admin, own for regular users)"""
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get_or_404(user_id)

            if user.role == 'admin':
                parcels = Parcel.query.all()
            else:
                parcels = Parcel.query.filter_by(sender_id=user.id).all()

            return parcels_schema.dump(parcels), 200

        except Exception as e:
            return {"message": "Failed to fetch parcels", "error": str(e)}, 500

    @jwt_required()
    def post(self):
        """Create a new parcel (authenticated users only)"""
        try:
            data = request.get_json()
            user_id = int(get_jwt_identity())
            
            # Validate required fields
            if not data.get('description'):
                return {"message": "Description is required"}, 400
            if not data.get('destination'):  # Ensure destination is included
                return {"message": "Destination is required"}, 400

            # Create parcel with required fields
            parcel = Parcel(
                description=data['description'],
                destination=data['destination'],  # Now properly included
                sender_id=user_id,  # Automatically set from JWT
                receiver_id=data.get('receiver_id'),  # Optional
                status='pending'  # Default status, not settable by user
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
        """Get specific parcel (owner or admin only)"""
        try:
            user_id = int(get_jwt_identity())
            user = User.query.get_or_404(user_id)
            parcel = Parcel.query.get_or_404(parcel_id)

            if user.role != 'admin' and parcel.sender_id != user.id:
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

            # Validate receiver exists if provided
            if 'receiver_id' in data and data['receiver_id']:
                if not User.query.get(data['receiver_id']):
                    return {"message": "Receiver not found"}, 404

            # Update allowed fields
            if 'description' in data:
                parcel.description = data['description']
            if 'status' in data:
                parcel.status = data['status']
            if 'receiver_id' in data:
                parcel.receiver_id = data['receiver_id']
            if 'destination' in data:
                parcel.destination = data['destination']

            db.session.commit()
            return parcel_schema.dump(parcel), 200

        except Exception as e:
            db.session.rollback()
            return {"message": "Failed to update parcel", "error": str(e)}, 500
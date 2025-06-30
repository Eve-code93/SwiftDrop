from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required
from app.models.parcel_tag import ParcelTag
from app.extensions import db
from app.schemas.parcel_tag import ParcelTagSchema
from app.utils.decorators import role_required

parcel_tag_schema = ParcelTagSchema()
parcel_tags_schema = ParcelTagSchema(many=True)

class ParcelTagListResource(Resource):
    @jwt_required()
    def get(self):
        return parcel_tags_schema.dump(ParcelTag.query.all()), 200

    @role_required("admin")
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('parcel_id', type=int, required=True)
        parser.add_argument('tag_id', type=int, required=True)
        args = parser.parse_args()

        parcel_tag = ParcelTag(**args)
        db.session.add(parcel_tag)
        db.session.commit()
        return parcel_tag_schema.dump(parcel_tag), 201

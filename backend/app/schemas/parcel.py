from marshmallow import Schema, fields, post_dump
from .tag import TagSchema
from .parcel_tag import ParcelTagSchema

class ParcelSchema(Schema):
    id = fields.Int(dump_only=True)
    description = fields.Str(required=True)
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    sender_id = fields.Int(required=True)
    receiver_id = fields.Int()

    tags = fields.Nested(ParcelTagSchema, many=True, dump_only=True)

from marshmallow import Schema, fields
from .tag import TagSchema
from .parcel_tag import ParcelTagSchema
from .user_schema import UserSchema  # ✅ Make sure this is imported

class ParcelSchema(Schema):
    id = fields.Int(dump_only=True)
    description = fields.Str(required=True)
    destination = fields.Str(required=True)
    status = fields.Str()
    created_at = fields.DateTime(dump_only=True)
    sender_id = fields.Int(required=True)
    receiver_id = fields.Int()

    sender = fields.Nested(UserSchema(only=("id", "email", )), dump_only=True)  # ✅ Add this
    agent = fields.Nested(UserSchema(only=("id", "email", )), dump_only=True)   # ✅ Add this
    tags = fields.Nested(ParcelTagSchema, many=True, dump_only=True)

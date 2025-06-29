from marshmallow import Schema, fields
from .user_schema import UserSchema
from .parcel_tag import ParcelTagSchema  # Optional if using tags

class ParcelSchema(Schema):
    id = fields.Int(dump_only=True)
    description = fields.Str(required=True)
    destination = fields.Str(required=True)
    status = fields.Str(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    sender_id = fields.Int(required=True)
    receiver_id = fields.Int(allow_none=True)
    agent_id = fields.Int(allow_none=True)

    # Related user details (read-only)
    sender = fields.Nested(UserSchema(only=("id", "email")), dump_only=True)
    agent = fields.Nested(UserSchema(only=("id", "email")), dump_only=True)
    receiver = fields.Nested(UserSchema(only=("id", "email")), dump_only=True)

    # Optional: Parcel tags
    tags = fields.Nested(ParcelTagSchema, many=True, dump_only=True)

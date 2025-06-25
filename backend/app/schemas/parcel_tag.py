from marshmallow import Schema, fields

class ParcelTagSchema(Schema):
    id = fields.Int(dump_only=True)
    parcel_id = fields.Int(required=True)
    tag_id = fields.Int(required=True)

from marshmallow import Schema, fields

class TrackingLogSchema(Schema):
    id = fields.Int(dump_only=True)
    parcel_id = fields.Int(required=True)
    status = fields.Str(required=True)
    location = fields.Str(required=True)
    timestamp = fields.DateTime(dump_only=True)

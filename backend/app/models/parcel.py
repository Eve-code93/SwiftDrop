# app/models/parcel.py
from datetime import datetime
from app.extensions import db

class Parcel(db.Model):
    __tablename__ = 'parcel'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255))
    destination = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    tracking_logs = db.relationship('TrackingLog', backref='parcel', lazy=True)
    tags = db.relationship('ParcelTag', back_populates='parcel', lazy=True, cascade='all, delete-orphan')
# app/models/parcel_tag.py
from app import db

class ParcelTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    parcel_id = db.Column(db.Integer, db.ForeignKey('parcel.id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'), nullable=False)

    tag = db.relationship('Tag')
    parcel = db.relationship('Parcel', back_populates='tags')
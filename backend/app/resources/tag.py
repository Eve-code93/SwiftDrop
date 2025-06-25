from flask_restful import Resource, reqparse
from app.models.tag import Tag
from app import db
from app.schemas.tag import TagSchema

tag_schema = TagSchema()
tags_schema = TagSchema(many=True)

class TagListResource(Resource):
    def get(self):
        return tags_schema.dump(Tag.query.all()), 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        args = parser.parse_args()

        tag = Tag(name=args['name'])
        db.session.add(tag)
        db.session.commit()
        return tag_schema.dump(tag), 201

# app/__init__.py

import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_restful import Api
from config import Config
from app.extensions import init_extensions, db
from app.models.user import User
from app.models.parcel import Parcel
from app.models.tracking_log import TrackingLog
from app.models.tag import Tag
from app.models.parcel_tag import ParcelTag

def create_app(config_class=Config):
    """Application factory to create and configure the Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # SQLAlchemy tuning (optional)
    app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {
        'pool_size': 10,
        'max_overflow': 20,
        'pool_pre_ping': True,
        'pool_recycle': 300,
    })

    # Initialize extensions
    init_extensions(app)

    # Set up Flask-RESTful API and register resources
    api = Api(app)
    register_resources(api)

    # Configure production logging
    configure_logging(app)

    # Register shell context
    setup_shell_context(app)

    # Optional debug route to view all registered routes
    @app.route("/__debug__/routes")
    def show_routes():
        output = []
        for rule in app.url_map.iter_rules():
            methods = ",".join(sorted(rule.methods))
            output.append(f"{rule.endpoint:25s} {methods:20s} {str(rule)}")
        return "<pre>" + "\n".join(output) + "</pre>"

    return app


def register_resources(api):
    """Register all API resources/endpoints"""
    print("📦 Registering resources...")

    try:
        from app.resources.auth import Register, Login
        from app.resources.parcel import ParcelListResource, ParcelResource
        from app.resources.tag import TagListResource
        from app.resources.tracking_log import TrackingLogResource

        print("✔ All resources imported")

        api.add_resource(Register, '/auth/register', endpoint='register')
        api.add_resource(Login, '/auth/login', endpoint='login')
        api.add_resource(ParcelListResource, '/parcels', endpoint='parcel_list')
        api.add_resource(ParcelResource, '/parcels/<int:parcel_id>', endpoint='parcel_detail')
        api.add_resource(TagListResource, '/tags', endpoint='tags')
        api.add_resource(TrackingLogResource, '/tracking/<int:parcel_id>', endpoint='tracking_log')

        print("✅ Routes registered")

    except Exception as e:
        print(f"❌ Failed to register resources: {e}")


def configure_logging(app):
    """Configure log file output for production"""
    if not app.debug and not app.testing:
        log_dir = 'logs'
        os.makedirs(log_dir, exist_ok=True)

        file_handler = RotatingFileHandler(
            os.path.join(log_dir, 'swiftdrop.log'),
            maxBytes=10240,
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('SwiftDrop application started')


def setup_shell_context(app):
    """Register models for flask shell"""
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'User': User,
            'Parcel': Parcel,
            'TrackingLog': TrackingLog,
            'Tag': Tag,
            'ParcelTag': ParcelTag
        }

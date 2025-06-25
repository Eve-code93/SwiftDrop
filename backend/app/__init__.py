import os
import logging
from flask import Flask
from logging.handlers import RotatingFileHandler

from config import Config, DevelopmentConfig, ProductionConfig, TestingConfig
from app.extensions import db, migrate, jwt, api


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Optional engine optimizations
    app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {
        'pool_size': 10,
        'max_overflow': 20,
        'pool_pre_ping': True,
        'pool_recycle': 300,
    })

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)

    # Register resources
    register_resources(app)
    
    # Configure logging
    configure_logging(app)

    # Shell context for Flask CLI
    from app.models.user import User
    from app.models.parcel import Parcel
    from app.models.tracking_log import TrackingLog
    from app.models.tag import Tag
    from app.models.parcel_tag import ParcelTag

    app.shell_context_processor(lambda: {
        'db': db,
        'User': User,
        'Parcel': Parcel,
        'TrackingLog': TrackingLog,
        'Tag': Tag,
        'ParcelTag': ParcelTag
    })

    return app


def register_resources(app):
    from app.resources.auth import Register, Login
    from app.resources.parcel import ParcelListResource, ParcelResource
    from app.resources.tag import TagListResource
    from app.resources.tracking_log import TrackingLogResource

    with app.app_context():
        api.add_resource(Register, '/auth/register')
        api.add_resource(Login, '/auth/login')
        api.add_resource(ParcelListResource, '/parcels')
        api.add_resource(ParcelResource, '/parcels/<int:parcel_id>')
        api.add_resource(TagListResource, '/tags')
        api.add_resource(TrackingLogResource, '/tracking/<int:parcel_id>')


def configure_logging(app):
    if not app.debug and not app.testing:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/swiftdrop.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)
        app.logger.info('SwiftDrop startup')

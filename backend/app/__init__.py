import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_restful import Api
from logging.handlers import RotatingFileHandler

from config import Config, DevelopmentConfig, ProductionConfig, TestingConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
api = Api()

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    app.config.setdefault('SQLALCHEMY_ENGINE_OPTIONS', {
        'pool_size': 10,
        'max_overflow': 20,
        'pool_pre_ping': True,
        'pool_recycle': 300,
    })

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    api.init_app(app)

    register_resources(app)
    configure_logging(app)

    from app.models.user import User
    app.shell_context_processor(lambda: {'db': db, 'User': User})

    return app

def register_resources(app):
    from app.resources.auth import Register, Login
    with app.app_context():
        try:
            api.add_resource(Register, '/auth/register')
            api.add_resource(Login, '/auth/login')
        except Exception as e:
            app.logger.error(f"Failed to register resources: {str(e)}")
            raise

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

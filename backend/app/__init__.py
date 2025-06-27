import os
import logging
from logging.handlers import RotatingFileHandler
from flask import Flask
from flask_restful import Api
from flask_cors import CORS  # Import CORS
from config import Config
from app.extensions import init_extensions, db
from app.models.user import User
from app.models.parcel import Parcel
from app.models.tracking_log import TrackingLog
from app.models.tag import Tag
from app.models.parcel_tag import ParcelTag

# Create logger at module level
logger = logging.getLogger(__name__)

def create_app(config_class=Config):
    """Application factory to create and configure the Flask app"""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Initialize CORS with default settings (allow all origins)
    CORS(app)

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

    # Root endpoint
    @app.route('/')
    def home():
        return {
            "message": "SwiftDrop API",
            "status": "running",
            "endpoints": {
                "auth": ["/auth/register", "/auth/login"],
                "parcels": "/parcels",
                "admin": "/admin/users"
            }
        }

    # Health check endpoint (required for Render)
    @app.route('/health')
    def health_check():
        return {
            "status": "healthy",
            "database": "connected" if db.engine else "disconnected"
        }, 200

    # Debug route to view all registered routes
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
    logger.info("Registering resources...")

    try:
        from app.resources.auth import Register, Login
        from app.resources.parcel import ParcelListResource, ParcelResource
        from app.resources.tag import TagListResource
        from app.resources.admin import UserListResource, UserRoleUpdateResource, AssignAgentResource
        from app.resources.agent import AgentDeliveryListResource, AgentDeliveryUpdateResource
        from app.resources.admin import AdminMetricsResource
        from app.resources.tracking_log import TrackingLogListResource, ParcelTrackingResource

        logger.info("All resources imported successfully")

        # Auth
        api.add_resource(Register, '/auth/register', endpoint='register')
        api.add_resource(Login, '/auth/login', endpoint='login')

        # Parcel
        api.add_resource(ParcelListResource, '/parcels', endpoint='parcel_list')
        api.add_resource(ParcelResource, '/parcels/<int:parcel_id>', endpoint='parcel_detail')

        # Tags
        api.add_resource(TagListResource, '/tags', endpoint='tags')

        # Admin
        api.add_resource(UserListResource, '/admin/users', endpoint='admin_users')
        api.add_resource(UserRoleUpdateResource, '/admin/users/<int:user_id>', endpoint='admin_user_update')
        api.add_resource(AssignAgentResource, '/admin/assign', endpoint='assign_agent')
        api.add_resource(AdminMetricsResource, '/admin/metrics')
        
        # Agent
        api.add_resource(AgentDeliveryListResource, '/agent/deliveries', endpoint='agent_deliveries')
        api.add_resource(AgentDeliveryUpdateResource, '/agent/deliveries/<int:parcel_id>', endpoint='agent_delivery_update')
        
        api.add_resource(TrackingLogListResource, '/tracking-logs')
        api.add_resource(ParcelTrackingResource, '/parcels/<int:parcel_id>/tracking')
        
        logger.info("Routes successfully registered")
    except Exception as e:
        logger.error(f"Failed to register resources: {str(e)}", exc_info=True)
        raise  # Re-raise the exception after logging


def configure_logging(app):
    """Configure log file output for production"""
    if not app.debug and not app.testing:
        # Remove existing handlers if any
        for handler in app.logger.handlers[:]:
            app.logger.removeHandler(handler)
        
        # Configure console logging (for Render)
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
        ))
        app.logger.addHandler(console_handler)
        
        # Optional: File logging (only if you need persistent logs)
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
import os
from dotenv import load_dotenv

load_dotenv()  # Only loads .env in development

class Config:
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql://swiftdrop_user:yourpassword@localhost:5432/swiftdrop"
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,
        'max_overflow': 10,
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    # Security
    SECRET_KEY = os.getenv("SECRET_KEY")  # No default in production!
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # No default in production!
    
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    # Environment
    FLASK_ENV = os.getenv("FLASK_ENV", "production")
    DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"
    TESTING = os.getenv("TESTING", "False") == "True"

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SESSION_COOKIE_SECURE = False  # Disabled for local development

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False
    PROPAGATE_EXCEPTIONS = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URL",
        "postgresql://swiftdrop_test:testpass@localhost:5432/swiftdrop_test"
    )
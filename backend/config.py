import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        default="postgresql://swiftdrop_user:yourpassword@localhost:5432/swiftdrop"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 5,
        'max_overflow': 10,
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }

    SECRET_KEY = os.getenv("SECRET_KEY", "your-default-secret-key-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key-change-me")

    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

    DEBUG = os.getenv("FLASK_DEBUG", "False") == "True"
    TESTING = os.getenv("TESTING", "False") == "True"

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False
    PROPAGATE_EXCEPTIONS = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URI",
        default="postgresql://swiftdrop_test:testpass@localhost:5432/swiftdrop_test"
    )

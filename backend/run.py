
import os
from dotenv import load_dotenv
from app import create_app, db
from flask_migrate import Migrate

load_dotenv()

from config import DevelopmentConfig, ProductionConfig, TestingConfig

env_config = os.getenv('FLASK_CONFIG', 'development').lower()

config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}

app = create_app(config_class=config_map.get(env_config, DevelopmentConfig))
migrate = Migrate(app, db)

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG'])

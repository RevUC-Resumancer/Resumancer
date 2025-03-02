from flask import Flask
from flask_cors import CORS
from app.api.resume_endpoints import resume_upload_blueprint

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": ["https://main.dgiaauliixglz.amplifyapp.com", "http://localhost:5173"]}})  # Allow only requests from this origin

    # Register Blueprints for the API endpoints
    app.register_blueprint(resume_upload_blueprint, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
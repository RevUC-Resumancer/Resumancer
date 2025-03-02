from flask import Flask
from flask_cors import CORS
from app.api.resume_upload import resume_upload_blueprint
# from app.api.resume_analysis import resume_analysis_blueprint
# from app.api.resume_comparison import resume_comparison_blueprint

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app, origins=["http://localhost:5173", "https://main.dgiaauliixglz.amplifyapp.com"])  # Allow only requests from this origin

    # Register Blueprints for different API endpoints
    app.register_blueprint(resume_upload_blueprint, url_prefix='/api')
    # app.register_blueprint(resume_analysis_blueprint)
    # app.register_blueprint(resume_comparison_blueprint)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

from flask import Flask
from app.api.resume_upload import resume_upload_blueprint
from app.api.resume_analysis import resume_analysis_blueprint
from app.api.resume_comparison import resume_comparison_blueprint

def create_app():
    app = Flask(__name__)

    # Register Blueprints for different API endpoints
    app.register_blueprint(resume_upload_blueprint)
    app.register_blueprint(resume_analysis_blueprint)
    app.register_blueprint(resume_comparison_blueprint)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

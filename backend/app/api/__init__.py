from flask import Blueprint

# Define Blueprints for each route
resume_upload_blueprint = Blueprint('resume_upload', __name__, url_prefix='/api/upload')
# resume_analysis_blueprint = Blueprint('resume_analysis', __name__, url_prefix='/api/analysis')
# resume_comparison_blueprint = Blueprint('resume_comparison', __name__, url_prefix='/api/comparison')

# Import routes
from .resume_endpoints import *
# from .resume_analysis import *
# from .resume_comparison import *

from flask import Blueprint

# Define Blueprints for each route
resume_upload_blueprint = Blueprint('resume_upload', __name__, url_prefix='/api/upload')

# Import routes
from .resume_endpoints import *

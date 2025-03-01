from flask import Blueprint, request, jsonify
import os
from app.services.amazon_s3 import upload_to_s3

# Initialize the blueprint for resume upload
resume_upload_blueprint = Blueprint('resume_upload', __name__)

# Optional: Local upload folder and allowed extensions (kept for file type validation)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'jpg', 'png'}

# Ensure the upload folder exists (if needed for other operations)
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to handle file upload and S3 integration
@resume_upload_blueprint.route('/upload', methods=['POST'])
def upload_resume():
    # Check if the request contains the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # If the user doesn't select a file, the browser may submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # If the file is allowed, attempt to upload it to S3
    if file and allowed_file(file.filename):
        # Set your S3 bucket name from an environment variable or hard-code it
        bucket_name = "resumancer-resume-storage"
        
        # Call the upload function from amazon_s3.py, passing the file
        s3_upload_success = upload_to_s3(file, bucket_name)
        
        if s3_upload_success:
            return jsonify({"message": f"Resume uploaded successfully to S3 bucket: {bucket_name}"}), 200
        else:
            return jsonify({"error": "File upload to S3 failed"}), 500
    else:
        return jsonify({"error": "Invalid file type. Allowed types are pdf, docx, txt, jpg, png."}), 400

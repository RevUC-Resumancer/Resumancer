from flask import Blueprint, request, jsonify
import os

# Initialize the blueprint for resume upload
resume_upload_blueprint = Blueprint('resume_upload', __name__)

# Path to save uploaded files (you can configure this as needed)
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt', 'jpg', 'png'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to handle file upload
@resume_upload_blueprint.route('/upload', methods=['POST'])
def upload_resume():
    # Check if the request contains the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # If the user doesn't select a file, the browser may submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    # If the file is allowed, save it
    if file and allowed_file(file.filename):
        # Securely handle the filename to avoid path traversal issues
        filename = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filename)

        # TODO: You can do any processing here (e.g., analyze the resume, store the data in a DB)

        # Clean up the file after processing
        os.remove(filename)  # This deletes the uploaded file

        return jsonify({"message": f"Resume uploaded successfully to {filename}"}), 200
    else:
        return jsonify({"error": "Invalid file type. Allowed types are pdf, docx, txt, jpg, png."}), 400

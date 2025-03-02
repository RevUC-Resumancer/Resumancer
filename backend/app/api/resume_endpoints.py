from flask import Blueprint, request, jsonify  # type: ignore
import os
from app.services.amazon_s3 import upload_to_s3
from app.services.document_process import process_document_from_s3  # Import the analysis function
from app.services.resume_optimization import get_resume_feedback

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
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        bucket_name = "resumancer-resume-storage"
        
        # Upload file to S3
        s3_upload_success = upload_to_s3(file, bucket_name)
        
        if s3_upload_success:
            document_name = file.filename  # Get the file name from the request

            # Process the document using Textract and Comprehend
            textract_response, comprehend_response = process_document_from_s3(bucket_name, document_name)
            
            if textract_response and comprehend_response:          
                
                # Sentiment analysis using Comprehend or another method
                sentiment = comprehend_response.get('Sentiment', 'NEUTRAL')  # Can be POSITIVE, NEGATIVE, NEUTRAL, MIXED

                # Format input for GPT: Pass the resume text and sentiment in a structured format
                gpt_input = str(textract_response)

                # Generate feedback by passing the structured input (resume text + sentiment) to GPT
                resume_feedback = get_resume_feedback(gpt_input, sentiment, comprehend_response)
                                
                # Optionally, send feedback back in the response
                return jsonify({
                    "message": "Document uploaded and analyzed successfully",
                    "feedback": resume_feedback
                }), 200
            
            else:
                return jsonify({"error": "Text analysis failed"}), 500
        else:
            return jsonify({"error": "File upload to S3 failed"}), 500
    else:
        return jsonify({"error": "Invalid file type. Allowed types are pdf, docx, txt, jpg, png."}), 400

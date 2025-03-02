import boto3 # type: ignore
import os
from dotenv import load_dotenv # type: ignore

# Load environment variables from the .env file
load_dotenv()

def upload_to_s3(file, bucket_name, object_name=None):
    """
    Uploads a file-like object to an AWS S3 bucket.

    Parameters:
        file (FileStorage): The file-like object to be uploaded. For example, Flask's file object.
        bucket_name (str): The name of the S3 bucket.
        object_name (str, optional): The S3 key name. If not provided, file.filename will be used.

    Returns:
        bool: True if the file was uploaded successfully, False otherwise.
    """
    # Use the file's filename if object_name is not provided
    if object_name is None:
        object_name = file.filename

    # Initialize the S3 client using credentials from the .env file
    s3_client = boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
        region_name=os.getenv('AWS_REGION')  # Optional: specify region if needed
    )
    
    try:
        # Use upload_fileobj to handle file-like objects
        s3_client.upload_fileobj(file, bucket_name, object_name)
        return True
    except Exception as e:
        # For production, consider logging the error details instead of printing
        print(f"Error uploading file to S3: {e}")
        return False

# Example usage:
# if __name__ == '__main__':
#     from werkzeug.datastructures import FileStorage
#     # This is just an example to illustrate usage.
#     # In practice, the file object would come from a Flask request.
#     with open('example.txt', 'rb') as f:
#         file_obj = FileStorage(stream=f, filename='example.txt')
#         success = upload_to_s3(file_obj, 'your-s3-bucket-name')
#         print("Upload successful:", success)

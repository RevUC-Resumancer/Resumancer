import boto3
import os

# Initialize AWS clients with the specified region
s3_client = boto3.client('s3', region_name='us-east-1')  # Replace with your desired region
textract_client = boto3.client('textract', region_name='us-east-1')  # Replace with your desired region
comprehend_client = boto3.client('comprehend', region_name='us-east-1')  # Replace with your desired region

def process_document_from_s3(bucket_name, document_name):
    """
    Retrieves a document from S3 and processes it using Amazon Textract.

    Parameters:
        bucket_name (str): The name of the S3 bucket.
        document_name (str): The name of the document in the S3 bucket.

    Returns:
        tuple: A tuple containing:
            - Extracted text from the document
            - NLP analysis results from Amazon Comprehend
    """
    try:
        # Retrieve the document from S3
        s3_client.download_file(bucket_name, document_name, document_name)

        # Open the document and process it with Textract
        with open(document_name, 'rb') as document:
            textract_response = textract_client.analyze_document(
                Document={'Bytes': document.read()},
                FeatureTypes=['TABLES', 'FORMS']
            )

        # Extract text from Textract response
        document_text = extract_text_from_textract(textract_response)

        # Process the document text using Amazon Comprehend
        comprehend_response = process_with_comprehend(document_text)

        # Optionally, remove the local file after processing
        os.remove(document_name)

        return document_text, comprehend_response  # Return extracted text and comprehend results
    except Exception as e:
        print(f"Error processing document: {e}")
        return None, None

def extract_text_from_textract(textract_response):
    """
    Extracts text from the Textract analysis response.

    Parameters:
        textract_response (dict): The response from Amazon Textract.

    Returns:
        str: Extracted text from the document.
    """
    text = ""
    # Loop through blocks and extract text from 'LINE' block types
    for item in textract_response.get('Blocks', []):
        if item['BlockType'] == 'LINE':
            text += item['Text'] + "\n"
    
    return text.strip()  # Strip leading/trailing whitespace from the result

def process_with_comprehend(document_text):
    """
    Analyzes text using Amazon Comprehend for NLP tasks like entity recognition, key phrases, sentiment, and language detection.

    Parameters:
        document_text (str): The text extracted from the document.

    Returns:
        dict: The response from Amazon Comprehend containing the NLP analysis results.
    """
    try:
        # Sentiment analysis
        sentiment_response = comprehend_client.detect_sentiment(Text=document_text, LanguageCode='en')

        # Key phrase extraction
        key_phrases_response = comprehend_client.detect_key_phrases(Text=document_text, LanguageCode='en')

        # Entity recognition
        entities_response = comprehend_client.detect_entities(Text=document_text, LanguageCode='en')

        # Language detection
        language_response = comprehend_client.detect_dominant_language(Text=document_text)

        return {
            'sentiment': sentiment_response,
            'key_phrases': key_phrases_response,
            'entities': entities_response,
            'language': language_response
        }
    except Exception as e:
        print(f"Error processing with Comprehend: {e}")
        return None

if __name__ == "__main__":
    # Example usage
    bucket_name = 'your-bucket-name'  # Replace with your S3 bucket name
    document_name = 'your-document.pdf'  # Replace with your document name in the S3 bucket

    extracted_text, comprehend_results = process_document_from_s3(bucket_name, document_name)
    
    if extracted_text:
        print("Extracted Text from Textract:")
        print(extracted_text)
    
    if comprehend_results:
        print("\nComprehend Analysis Results:")
        print(f"Sentiment: {comprehend_results['sentiment']}")
        print(f"Key Phrases: {comprehend_results['key_phrases']}")
        print(f"Entities: {comprehend_results['entities']}")
        print(f"Language: {comprehend_results['language']}")

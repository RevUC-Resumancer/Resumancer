import boto3
import json
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError

def get_resume_feedback(resume_text):
    """
    Analyzes the parsed resume text using Amazon Bedrock's generative AI models to provide detailed feedback.

    Parameters:
        resume_text (str): The parsed content of the resume.

    Returns:
        dict: A dictionary containing the model's feedback or an error message.
    """
    try:
        # Initialize the Bedrock Runtime client
        bedrock_runtime_client = boto3.client('bedrock-runtime', region_name='us-east-1')

        # Define the model ID
        model_id = 'amazon.nova-pro-v1:0'  # Replace with your actual model ID

        # Construct the prompt for detailed analysis
        prompt = (
            "Please analyze the following resume. For each line, return the line number it matched with, "
            "provide a score from 1 to 10, and explain your reasoning in the following format:\n\n"
            "'Line #: [line number]\nScore: [score]\nExplanation: [explanation]'\n\n"
            "At the end you will find the resume sentiment. This is just for your knowledge, do not return it."
            "Do not reply with any other text, just the formatted output. Here's the resume text:\n\n" + resume_text
        )


        # Prepare the payload
        payload = {
            "inferenceConfig": {
                "max_new_tokens": 5000
            },
            "messages": [
                {
                    "role": "user",
                    "content": [{"text": prompt}]
                }
            ]
        }

        # Debug print to log the payload being sent
        #print(f"Payload being sent to Bedrock model: {json.dumps(payload, indent=2)}")

        # Convert the payload to JSON and then to bytes
        payload_bytes = json.dumps(payload).encode('utf-8')

        # Invoke the Bedrock model
        response = bedrock_runtime_client.invoke_model(
            modelId=model_id,
            body=payload_bytes,
            contentType='application/json',
            accept='application/json'
        )

        # Parse the response body
        response_body = json.loads(response['body'].read().decode('utf-8'))

        # Log the raw response to inspect its structure
        print("Raw Bedrock Response:", json.dumps(response_body, indent=2))

        # Handle the structure of the response
        if len(response_body) > 0:
            return response_body['output']['message']['content'][0]  # Assuming feedback is nested in 'feedback'
        else:
            return {"error": "Feedback not found in response."}

    except (NoCredentialsError, PartialCredentialsError):
        return {"error": "AWS credentials are not properly configured."}
    except ClientError as e:
        return {"error": f"Client error occurred: {e}"}
    except Exception as e:
        return {"error": f"An error occurred: {e}"}

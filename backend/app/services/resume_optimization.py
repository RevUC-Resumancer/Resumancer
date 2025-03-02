import boto3
import json
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
import threading

def get_resume_feedback(resume_text):
    """
    Analyzes the parsed resume text using Amazon Bedrock's generative AI models to provide detailed feedback.

    Parameters:
        resume_text (str): The parsed content of the resume.

    Returns:
        dict: A dictionary containing the model's feedback or an error message.
    """
    def ask_model(resume_part, result_container, index):
        try:
            # Initialize the Bedrock Runtime client
            bedrock_runtime_client = boto3.client('bedrock-runtime', region_name='us-east-1')

            # Define the model ID
            model_id = 'amazon.nova-pro-v1:0'  # Replace with your actual model ID

            # Construct the prompt for detailed analysis
            prompt = (
                "Please analyze the following resume in INCREDIBLE detail. For each response, respond in INCREDIBLE detail. Do not regard any token limits "
                "provide a score from 1 to 10, and explain your reasoning in the following format:\n\n"
                "'Line: [the first three words of the LINE you just evaluated]\nScore: [score based on its proposed soundness of landing a job ]\nExplanation: [explanation in depth of why it's good/bad, please write 3-5 sentences]'\n\n"
                "At the end you will find the resume sentiment. This is just for your knowledge, do not return it."
                "Do not reply with any other text, just the formatted output. Here's the resume text:\n\n" + resume_part
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

            # Extract the feedback text
            result_container[index] = response_body['output']['message']['content'][0]['text'] if len(response_body) > 0 else "Feedback not found in response."

        except (NoCredentialsError, PartialCredentialsError):
            result_container[index] = "AWS credentials are not properly configured."
        except ClientError as e:
            result_container[index] = f"Client error occurred: {e}"
        except Exception as e:
            result_container[index] = f"An error occurred: {e}"

    # Split the resume text at the nearest newline before the middle
    mid_index = len(resume_text) // 2
    split_index = resume_text.rfind('\n', 0, mid_index)
    if split_index == -1:  # If no newline is found, fall back to mid_index
        split_index = mid_index

    first_half = resume_text[:split_index]
    second_half = resume_text[split_index:]

    # Prepare a container to hold the results of both threads
    results = [None, None]

    # Create threads to run both halves concurrently
    thread1 = threading.Thread(target=ask_model, args=(first_half, results, 0))
    thread2 = threading.Thread(target=ask_model, args=(second_half, results, 1))

    # Start both threads
    thread1.start()
    thread2.start()

    # Wait for both threads to finish
    thread1.join()
    thread2.join()

    # Combine feedback from both threads
    combined_feedback = results[0] + '\n\n' + results[1]

    return combined_feedback

import boto3
import json
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
import threading

def analyze_with_ai(prompt, model_id='amazon.nova-pro-v1:0'):
    """
    Calls the generative AI model to process the given prompt.

    Parameters:
        prompt (str): The text prompt to pass to the AI model.
        model_id (str): The model ID to use for analysis.

    Returns:
        str: The response from the model.
    """
    try:
        # Initialize the Bedrock Runtime client
        bedrock_runtime_client = boto3.client('bedrock-runtime', region_name='us-east-1')

        # Prepare the payload for the model
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

        # Invoke the model
        response = bedrock_runtime_client.invoke_model(
            modelId=model_id,
            body=payload_bytes,
            contentType='application/json',
            accept='application/json'
        )

        # Parse the response body
        response_body = json.loads(response['body'].read().decode('utf-8'))

        # Extract and return the feedback text from the response
        return response_body['output']['message']['content'][0]['text'] if len(response_body) > 0 else "Feedback not found in response."

    except (NoCredentialsError, PartialCredentialsError):
        return "AWS credentials are not properly configured."
    except ClientError as e:
        return f"Client error occurred: {e}"
    except Exception as e:
        return f"An error occurred: {e}"

def get_resume_feedback(resume_text, sentiment, tokenized_text):
    """
    Analyzes the parsed resume text and tokenized text using Amazon Bedrock's generative AI models
    to provide detailed feedback, sorted by relevance to the user's industry.

    Parameters:
        resume_text (str): The parsed content of the resume.
        sentiment (str): The sentiment of the resume (e.g., positive, neutral, negative).
        tokenized_text (str): The tokenized version of the resume text.

    Returns:
        dict: A dictionary containing the model's feedback or an error message.
    """

    def ask_model(resume_part, result_container, index):
        try:
            # Analyze the resume text for detailed feedback
            prompt = f"""
                Please conduct an extremely thorough analysis of the following resume text. Each section must be evaluated in meticulous detail, with highly precise, consistent, and insightful feedback. Provide very verbose explanations that are rooted in industry standards and best practices for resumes in the tech field.

                Follow this format for each section you evaluate:

                Section: [Name of the section you evaluated, must be a section with member text.]
                Score: [Score from 1 to 10 based on how strong and impactful the section is in terms of securing a job, with clear reasoning behind the score]
                Explanation: [Provide a comprehensive explanation (3-5 sentences) with a deep dive into why the section earns the given score. Consider elements such as clarity, conciseness, relevance to the role, use of action verbs, quantifiable achievements, structure, overall impact, and alignment with current industry trends. Critically assess both strengths and weaknesses. Be very specific and use real examples wherever possible, comparing the section to the expectations of recruiters or hiring managers. Focus on how the section could help or hinder a candidate's chances.]

                Provide an objective evaluation for every section—covering all relevant areas such as experience, skills, education, certifications, projects, and more. Consider common pitfalls, areas for improvement, and highlight any missing elements that could make the resume stronger. Use the scoring scale to provide a fair but critical assessment, highlighting both the positive and negative aspects with actionable suggestions.

                Do not add any additional conversation or markdown and seperate sections by a ; and focus only on providing a pure, detailed evaluation of the resume's content and structure. Do not include any ** or related, no styling!

                Here's the resume text to evaluate:

                {resume_part}
            """
                
            result_container[index] = analyze_with_ai(prompt)

        except Exception as e:
            result_container[index] = f"An error occurred: {e}"

    # Prepare a container to hold the results of the thread
    results = [None]

    # Create a thread to process the resume text in its entirety
    thread1 = threading.Thread(target=ask_model, args=(resume_text, results, 0))

    # Start the thread
    thread1.start()

    # Wait for the thread to finish
    thread1.join()

    # Combine feedback from all threads (in this case, just one thread)
    combined_feedback = results[0]
    
    # Convert tokenized_text from dict to string
    tokenized_text_str = json.dumps(tokenized_text)  # Convert tokenized_text dict to string

    # Now make another AI call for the tokenized text, asking for the feedback to be sorted by industry relevance
    tokenized_feedback = analyze_with_ai(
        f"Please provide feedback for the following tokenized text. Sort and rate the entities and key phrases based on their importance and relevance to the user's industry. DO NOT include additional commentary or markdown.\n\n"
        f"Please sort by hard or soft skills above all else relevant to the industry the user is in. Do not include places, names, and anything unrelated to skills."
        f"Also, no personal information, or unrelated topics such as emails, names, or unrelated fragments should not be rated, and should be removed from the list."
        f"Please format the feedback as follows: "
        f"Each entity/phrase, followed by its relevance score (from 1 to 10), separated by a comma. "
        f"Separate each entity's feedback with a semicolon. "
        f"Example: 'Entity1, 8; Entity2, 7; Entity3, 9'. "
        f"Here is the tokenized text:\n\n" + tokenized_text_str
    )

    # Return the combined feedback and tokenized feedback in a structured format
    final_output = {
        "sentiment_analysis": sentiment,
        "tokenized_text": tokenized_text,
        "final_review": combined_feedback,
        "tokenized_feedback": tokenized_feedback  # Add tokenized feedback here
    }

    return final_output

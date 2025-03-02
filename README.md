![resumancer-title](./screenshots/resumancer-title.png)

## Project Description

AI-powered resume optimizer using Generative AI, LLMs, and NLP, built with React (JS) for the frontend, Flask (Python) for the backend, and leveraging AWS services like S3, Beanstalk, and Bedrock. Built during University of Cincinnati, RevUC Hackathon 2025.

## Demo Video

<table style="border: 2px solid firebrick; display: inline-block;">
  <tr><td>
    <a href="https://youtu.be/sqXrGAmo-as">
      <img src="https://img.youtube.com/vi/sqXrGAmo-as/hqdefault.jpg" alt="Demo Video">
    </a>
  </td></tr>
</table>


## Gallery

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; text-align: center;">

  <figure style="margin: 0 10px;">
    <img src="./screenshots/app.png" alt="App" style="width: 45%;">
    <figcaption>App Main Screen</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/resume-upload-component.png" alt="Resume Upload Component" style="width: 45%;">
    <figcaption>Resume Upload Component</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/resume-upload-component-uploading.png" alt="Resume Upload Component Uploading" style="width: 45%;">
    <figcaption>Uploading Process</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/resume-viewer-component.png" alt="Resume Viewer Component" style="width: 45%;">
    <figcaption>Resume Viewer</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/resume-feedback-component-1.png" alt="Resume Feedback Component 1" style="width: 45%;">
    <figcaption>Feedback Section 1</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/resume-feedback-component-2.png" alt="Resume Feedback Component 2" style="width: 45%;">
    <figcaption>Feedback Section 2</figcaption>
  </figure>

  <figure style="margin: 0 10px;">
    <img src="./screenshots/generative-ai-component.png" alt="Generative AI Component" style="width: 45%;">
    <figcaption>Generative AI Enhancements</figcaption>
  </figure>

</div>

## Tech Stacks

### Application

- Backend: Flask with Python
  - Web server: Gunicorn + Nginx, SSL
- Frontend: React with JavaScript
  - Styling: Material UI
  - API calls: Axios

### Cloud Services

- AWS Elastic Beanstalk + EC2
- Amazon S3
- AWS Amplify
- Amazon Textract (OCR)
- Amazon Comprehend (NLP)
- Amazon Macie
- Amazon Bedrock (generative AI)

## Project Structure

### `frontend/`
- `public/index.html`: The main HTML file that serves as the entry point for the React application
- `src/assets/`: Contains static assets such as images (including SVGs), fonts, and stylesheets
- `src/components/`: Houses React components, each serving a specific function
- `src/hooks/useResume.js`: Custom React hook for managing resume-related state and logic, use Redux.js
- `src/services/api.js`: Contains functions for making API calls to the backend, utilizing Axios for HTTP requests
- `src/App.jsx`: The root component that integrates all other components and manages routing
- `src/index.js`: The entry point for the React application, rendering the App component


### `backend/`
- `app/api/`: Contains route definitions for various endpoints
- `app/services/`: Implements the core business logic, cloud services
- `app/config.py`: Contains configuration settings on the server
- `app/requirements.txt`: Lists the Python dependencies required for the backend

## Biggest Challenges

1. Getting the frontend to talk to the backend
1. Upgrading from HTTP to HTTPS
1. Getting the generative AI to provide useful feedback
1. Implementing the Resume Viewer component

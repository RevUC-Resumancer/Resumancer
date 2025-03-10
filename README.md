![resumancer-title](./screenshots/resumancer-title.png)

## Project Description

AI-powered resume optimizer using Generative AI, LLMs, and NLP, built with React (JS) for the frontend, Flask (Python) for the backend, and leveraging AWS services like S3, Beanstalk, and Bedrock. Built during University of Cincinnati, RevUC Hackathon 2025.

## Demo Video

[![Watch on YouTube](https://img.shields.io/badge/Watch%20on-YouTube-red?logo=youtube)](https://www.youtube.com/watch?v=sqXrGAmo-as)

## Gallery

| Image | Description |
|-------|-------------|
| ![App Main Screen](./screenshots/app.png) | **App Main Screen** |
| ![Resume Upload Component](./screenshots/resume-upload-component.png) | **Resume Upload Component** |
| ![Uploading Process](./screenshots/resume-upload-component-uploading.png) | **Uploading Process** |
| ![Resume Viewer](./screenshots/resume-viewer-component.png) | **Resume Viewer** |
| ![Feedback Section 1](./screenshots/resume-feedback-component-1.png) | **Feedback Section 1** |
| ![Feedback Section 2](./screenshots/resume-feedback-component-2.png) | **Feedback Section 2** |
| ![Generative AI Enhancements](./screenshots/generative-ai-component.png) | **Generative AI Enhancements** |

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

import axios from 'axios';

// Set the base URL for your backend API
const API_BASE_URL = 'https://main.dgiaauliixglz.amplifyapp.com/api' || 'http://localhost:5000/api'; // Update to the actual backend URL if needed

// Function to upload resume
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file); // Add the resume file to the form data

  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set content type for file upload
      },
    });

    return response.data; // Return the response from the backend
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error; // Throw the error to be handled by the caller
  }
};

// You can add more API functions as needed for other routes, such as:
export const analyzeResume = async (resumeData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, resumeData);
    return response.data;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
};

export const compareResumes = async (resumeData, jobDescription) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/compare`, {
      resume: resumeData,
      job_description: jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error('Error comparing resumes:', error);
    throw error;
  }
};

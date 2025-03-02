import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { uploadResume } from '../services/api';

const ResumeUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null); // State to hold the file
  const [isUploading, setIsUploading] = useState(false); // To track upload progress
  const [error, setError] = useState(''); // For error messages

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a resume file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Make the API call to upload the file and track progress
      const response = await uploadResume(file);

      if (response) {
        // If upload is successful, reset progress and show success
        setIsUploading(false);

        // Pass both file and resumeData (response) back to the parent component
        onFileUpload(file, response['feedback']); // Passing both file and response (feedback obj)

        setFile(null); // Reset file after upload
        alert('Resume uploaded and analyzed successfully!');
      }
    } catch (error) {
      setIsUploading(false);
      setError('Error uploading the resume, please try again.');
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>Upload your Resume</Typography>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileChange}
        disabled={isUploading}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}
          disabled={isUploading}
        >
          Choose Resume
        </Button>
      </label>

      {file && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Selected File: {file.name}
        </Typography>
      )}

      {isUploading && (
        <Box sx={{ marginTop: '20px' }}>
          <CircularProgress />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading and Processing...
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {!isUploading && file && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          sx={{ mt: 2 }}
        >
          Upload Resume
        </Button>
      )}
    </Box>
  );
};

export default ResumeUpload;

import React, { useState } from 'react';
import { Button, LinearProgress, Typography, Box } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';

const ResumeUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null); // State to hold the file
  const [isUploading, setIsUploading] = useState(false); // To track upload progress
  const [uploadProgress, setUploadProgress] = useState(0); // Track the progress percentage
  const [error, setError] = useState(''); // For error messages

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!file) {
      setError('Please select a resume file to upload');
      return;
    }

    setIsUploading(true);
    setError('');

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 100) {
        progress += 10;
        setUploadProgress(progress);
      } else {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        // Pass file to parent component for use in display
        onFileUpload(file);
        setFile(null); // Reset file after upload
        alert('Resume uploaded successfully!');
      }
    }, 500); // Simulate progress every 500ms
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
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading... {uploadProgress}%
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

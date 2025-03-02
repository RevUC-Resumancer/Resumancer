import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, CircularProgress, Typography, Box } from '@mui/material';
import { UploadFile as UploadFileIcon } from '@mui/icons-material';
import { uploadResume } from '../services/api';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Cookies from 'js-cookie'; // To manage cookies

const ResumeUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null); // State to hold the file
  const [isUploading, setIsUploading] = useState(false); // To track upload progress
  const [error, setError] = useState(''); // For error messages
  const [startTime, setStartTime] = useState(null); // To track the start time
  const [averageTime, setAverageTime] = useState(null); // To store average time
  const [currentUploadTime, setCurrentUploadTime] = useState(null); // To store current upload time

  // This effect initializes the average time from cookies on component mount
  useEffect(() => {
    const timesList = Cookies.get('uploadTimes');
    if (timesList) {
      const timesArray = JSON.parse(timesList);
      const avg = timesArray.reduce((acc, time) => acc + time, 0) / timesArray.length;
      setAverageTime(avg);
    }
  }, []);

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
    const uploadStartTime = Date.now(); // Start the timer immediately before upload begins
    setStartTime(uploadStartTime); // Store start time for tracking

    try {
      // Make the API call to upload the file and track progress
      const response = await uploadResume(file);

      if (response) {
        setIsUploading(false); // End uploading process
        console.log(response['feedback'])
        onFileUpload(file, response['feedback']); // Pass both file and response (feedback obj)

        const uploadEndTime = Date.now(); // Calculate end time after upload completion
        const timeTaken = (uploadEndTime - uploadStartTime) / 1000; // Time taken in seconds

        // Retrieve previous times from cookies, add the new one, and update cookie
        const timesList = Cookies.get('uploadTimes');
        const timesArray = timesList ? JSON.parse(timesList) : [];
        timesArray.push(timeTaken); // Add the new time to the array

        // Update the cookie with the new times array
        Cookies.set('uploadTimes', JSON.stringify(timesArray), { expires: 365 }); // Save for 365 days

        // Update the average time
        const avg = timesArray.reduce((acc, time) => acc + time, 0) / timesArray.length;
        setAverageTime(avg); // Update average time

        setFile(null); // Reset file after upload
      }
    } catch (error) {
      setIsUploading(false);
      setError('Error uploading the resume, please try again.');
      console.error(error);
    }
  };

  // Update current upload time while uploading (running timer during upload)
  useEffect(() => {
    let interval;
    if (isUploading && startTime) {
      interval = setInterval(() => {
        setCurrentUploadTime(((Date.now() - startTime) / 1000).toFixed(0)); // Update every 100ms
      }, 100);
    }

    return () => clearInterval(interval); // Clean up interval on component unmount or when upload finishes
  }, [isUploading, startTime]);

  // Memoize the PDF Viewer to prevent it from re-rendering unnecessarily
  const memoizedViewer = useMemo(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      return (
        <div style={{ flex: 1, overflow: 'none', opacity: isUploading ? 0.5 : 1 }}>
          <Worker>
            <Viewer fileUrl={objectUrl} initialPage={0} />
          </Worker>
        </div>
      );
    }
    return null; // Return null if file is not set
  }, [file, isUploading]); // Only re-render when 'file' or 'isUploading' changes

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>Upload your Resume</Typography>

      {file && (
        <div style={{ height: 'auto', width: '15vw', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {isUploading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0)',
              zIndex: 2
            }}>
              <CircularProgress />
            </div>
          )}
          {memoizedViewer}
        </div>
      )}

      {file && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, marginTop: '20px' }}>
          {file.name}
        </Typography>
      )}
      
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isUploading}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          sx={{ marginTop: '20px' }}
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}
          disabled={isUploading}
        >
          Choose Resume
        </Button>
      </label>

      {isUploading && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Uploading and Processing...
          </Typography>
          <br/>
          {currentUploadTime && (
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {currentUploadTime} seconds / ~{averageTime ? averageTime.toFixed(0) : 'N/A'}
            </Typography>
          )}
        </Box>
      )}

      <br/>

      {!isUploading && file && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleFileUpload}
          sx={{ mt: 2 }}
        >
          Upload
        </Button>
      )}

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {averageTime !== null && !isUploading && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          Average Time: {averageTime.toFixed(0)} seconds
        </Typography>
      )}
    </Box>
  );
};

export default ResumeUpload;

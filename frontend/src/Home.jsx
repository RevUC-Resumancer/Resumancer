import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResumeDisplay from './components/ResumeDisplay';
import FeedbackDisplay from './components/FeedbackDisplay';
import { Box } from '@mui/material';

const Home = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [resumeData, setResumeData] = useState(null); // State to store resume analysis data

  // Function to handle the file upload and pass both file and resume data
  const handleFileUpload = (uploadedFile, analysisData) => {
    setFile(uploadedFile); // Set the uploaded file
    setResumeData(analysisData); // Set the resume analysis data
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="stretch"
        flex={1}
        overflow="auto"
      >
        <center>
          <ResumeUpload onFileUpload={handleFileUpload} /> {/* Pass the handler to ResumeUpload */}
          {file && resumeData && (
            <>
              {console.log(resumeData)}
              <ResumeDisplay file={file} /> 
              <FeedbackDisplay feedbackData={resumeData} />
            </>
          )}
        </center>
      </Box>
    </Box>
  );
};

export default Home;

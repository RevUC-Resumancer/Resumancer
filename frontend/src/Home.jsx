import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResumeDisplay from './components/ResumeDisplay';
import { Box } from '@mui/material';

const Home = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file

  // Function to handle the file upload and pass it to the state
  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
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
          {file && <ResumeDisplay file={file} />} {/* Pass the uploaded file to ResumeDisplay */}
        </center>
      </Box>
    </Box>
  );
};

export default Home;

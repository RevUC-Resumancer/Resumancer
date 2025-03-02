import React, { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import ResumeDisplay from './components/ResumeDisplay';
import FeedbackDisplay from './components/FeedbackDisplay';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Alert 
} from '@mui/material';

const Home = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [resumeData, setResumeData] = useState(null); // State to store resume analysis data
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  // Function to handle the file upload and pass both file and resume data
  const handleFileUpload = (uploadedFile, analysisData) => {
    setFile(uploadedFile); // Set the uploaded file
    setResumeData(analysisData); // Set the resume analysis data
    setDialogOpen(true); // Open the dialog on successful submission
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
          <Box 
            sx={{
              position: 'relative', 
              zIndex: 1, 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center'
            }}
          >
            <img 
              src={'/favicon.png'} 
              alt="Logo" 
              style={{ width: '20vw' }} 
            />
          </Box>
          <ResumeUpload onFileUpload={handleFileUpload} />
          {file && resumeData && (
            <Dialog 
              open={dialogOpen} 
              onClose={() => setDialogOpen(false)} 
              fullScreen
            >
              <DialogTitle>Resume Analysis</DialogTitle>
              <DialogContent dividers>
                {console.log(resumeData)}
                <ResumeDisplay file={file} feedbackData={resumeData} />
                <FeedbackDisplay feedbackData={resumeData} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </center>
      </Box>
    </Box>
  );
};

export default Home;

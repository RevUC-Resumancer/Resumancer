import React, { useState, useEffect } from 'react';
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
  Typography 
} from '@mui/material';

const Home = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [resumeData, setResumeData] = useState(null); // State to store resume analysis data
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  const generateImagePattern = () => {
    const positions = [];
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    const imageWidth = 50; // Width of images
    const imageHeight = 50; // Height of images

    const columns = Math.ceil(maxWidth / (imageWidth + 20)); // Number of columns
    const rows = Math.ceil(maxHeight / (imageHeight + 20)); // Number of rows

    // Alternate images
    const images = ['/dragon1.png', '/dragon2.png', '/dragon3.png'];

    // Generate images along the vertical sides
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const offsetX = Math.random() * 40 - 20; // Random offset between -20px and 20px
        const offsetY = Math.random() * 40 - 20; // Random offset between -20px and 20px

        const xPos = j * (imageWidth + 20) + offsetX;
        const yPos = i * (imageHeight + 20) + offsetY;

        // Generate images on the left and right sides
        if (xPos < maxWidth / 4 || xPos > (maxWidth / 4) * 3) {
          positions.push({
            x: xPos,
            y: yPos,
            image: images[(i + j) % images.length] // Alternate between dragon images
          });
        }
      }
    }

    return positions;
  };

  const [imagePositions, setImagePositions] = useState([]);

  // Generate image pattern when the component mounts
  useEffect(() => {
    const positions = generateImagePattern();
    setImagePositions(positions);
  }, []);

  // Function to handle the file upload and pass both file and resume data
  const handleFileUpload = (uploadedFile, analysisData) => {
    setFile(uploadedFile); // Set the uploaded file
    setResumeData(analysisData); // Set the resume analysis data
    setDialogOpen(true); // Open the dialog on successful submission
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100vh" 
      position="relative" 
      overflow="hidden" 
      sx={{ padding: 0, margin: 0 }} 
    >
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="flex-start" 
        alignItems="stretch" 
        flex={1} 
        overflow="hidden" 
        height="100%" 
      >
        <center>
          <Box 
            sx={{
              position: 'relative', 
              zIndex: 1, 
              p: 2, 
              display: 'flex', 
              justifyContent: 'center',
              marginBottom: '20px', 
            }}
          >
            <Typography 
              variant="h2" 
              color="primary" 
              sx={{
                fontWeight: 'bold', 
                fontSize: '3rem', 
                position: 'absolute', 
                top: '0', 
                zIndex: 2, 
                letterSpacing: '1px',
                textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)' 
              }}
            >
              Resumancer
            </Typography>
          </Box>

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
              sx={{
                height: '100vh',
                margin: 0,
                padding: 0,
              }}
            >
              <DialogTitle>Resume Analysis</DialogTitle>
              <DialogContent dividers>
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

      {/* Randomly positioned and alternating images with animation classes */}
      {imagePositions.map((pos, index) => (
        <img
          key={index}
          src={pos.image} 
          alt={`Random Placeholder ${index}`}
          className={`dragonImage ${pos.image === '/dragon1.png' ? 'dragon1' : pos.image === '/dragon2.png' ? 'dragon2' : 'dragon3'}`}
          style={{
            top: `${pos.y}px`,
            left: `${pos.x}px`,
            zIndex: 0,
            position: 'absolute',
            width: '50px',
            height: '50px',
            animationDuration: '5s',
            animationIterationCount: 'infinite',
          }}
        />
      ))}

      {/* Directly embedded CSS in the JS */}
      {/* Directly embedded CSS in the JS */}
      <style>
        {`
          .dragonImage {
            position: absolute;
            width: 50px;
            height: 50px;
            animation-duration: 10s; /* Adjust duration for slow movement */
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-name: floatingAnimation;
          }

          @keyframes floatingAnimation {
            0% {
              transform: translateX(0) translateY(0);
              opacity: 0.8;
            }
            25% {
              transform: translateX(10px) translateY(-10px);
              opacity: 1;
            }
            50% {
              transform: translateX(0) translateY(-10px);
              opacity: 0.8;
            }
            75% {
              transform: translateX(-10px) translateY(10px);
              opacity: 1;
            }
            100% {
              transform: translateX(0) translateY(0);
              opacity: 0.8;
            }
          }

          /* Randomize the speed for each dragon */
          .dragon1 {
            animation-duration: 12s; /* Slow float */
          }

          .dragon2 {
            animation-duration: 14s; /* Slightly slower */
          }

          .dragon3 {
            animation-duration: 16s; /* Slower float */
          }
        `}
      </style>
    </Box>
  );
};

export default Home;

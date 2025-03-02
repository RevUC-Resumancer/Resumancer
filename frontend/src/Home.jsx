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
import * as pdfjsLib from 'pdfjs-dist';

const Home = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [resumeData, setResumeData] = useState(null); // State to store resume analysis data
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [pdfImage, setPdfImage] = useState(null); // State to store the rendered PDF image

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
    setResumeData(analysisData); // Set the resume analysis data as an object
    setDialogOpen(true); // Open the dialog on successful submission

    // Check if it's a PDF and render the image preview
    if (uploadedFile.type === 'application/pdf') {
      renderPdfAsImage(uploadedFile);
    }
  };

  // Function to render PDF as image
  const renderPdfAsImage = (pdfFile) => {
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const pdfData = new Uint8Array(fileReader.result);
      const pdf = await pdfjsLib.getDocument(pdfData).promise;

      const page = await pdf.getPage(1); // Rendering the first page of the PDF
      const scale = 1.5; // Adjust scale for rendering
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render the PDF page into the canvas context
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert the canvas to an image and set it to state
      const img = canvas.toDataURL();
      setPdfImage(img);
    };
    fileReader.readAsArrayBuffer(pdfFile);
  };

  // Generate image preview for image files and PDF previews for PDFs
  const renderFilePreview = () => {
    if (file && file.type === 'application/pdf' && pdfImage) {
      return <img 
      src={pdfImage} 
      alt="PDF Preview" 
      style={{ 
        maxWidth: '100%', 
        maxHeight: '30vh', 
        borderRadius: '8px', 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' // Adds a subtle shadow effect
      }} 
    />;
    }
    return null;
  };

  return (
    <Box 
      display="block" 
      position="relative" 
      overflow="hidden" 
      sx={{ padding: 0, margin: 0, height: '100vh' }} 
    >
      {/* Main content container becomes scrollable if content overflows */}
      <Box 
        sx={{
          position: 'relative',
          height: '100%',
          width: '100%',
          overflowY: 'auto', // Enable scrolling
        }}
      >
        <Box 
          sx={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', // Center content absolutely
            textAlign: 'center',
            zIndex: 1,
            width: '100%',
          }}
        >
          <Typography 
            variant="h2" 
            color="primary" 
            sx={{
              fontWeight: 'bold', 
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              letterSpacing: '1px',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
            }}
          >
            Resu<span style={{ color: 'red' }}>m</span>ancer
          </Typography>

          <Box 
            sx={{
              p: 2,
              display: 'block',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <img 
              src={'/favicon.png'} 
              alt="Logo" 
              style={{ width: '20vw', maxWidth: '200px' }} 
            />
          </Box>

          <Box 
            sx={{
              display: 'block',
              justifyContent: 'center',
              alignItems: 'center', 
              width: '100%',
              mb: 2,
            }}
          >
            {file && renderFilePreview()}
            <ResumeUpload onFileUpload={handleFileUpload} />
          </Box>

          {file && resumeData && (
            <Dialog 
              open={dialogOpen} 
              onClose={() => setDialogOpen(false)} 
              fullScreen
              scroll="paper"
              PaperProps={{
                sx: {
                  maxWidth: '100%',
                  height: '100%',
                  margin: 0,
                  padding: 0,
                },
              }}
            >
              <DialogTitle>Resume Analysis</DialogTitle>
              <DialogContent 
                dividers 
                sx={{ 
                  overflowY: 'auto', 
                  maxHeight: 'calc(100vh - 150px)', 
                  padding: 2 
                }}
              >
                <ResumeDisplay file={file} feedbackData={resumeData} />
                <FeedbackDisplay feedbackData={resumeData} />
              </DialogContent>
              <DialogActions 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center', 
                  p: 2,
                }}
              >
                <Button onClick={() => setDialogOpen(false)} color="primary" variant="contained">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </Box>

      {/* Randomly positioned and alternating images with animation classes */}
      {imagePositions.map((pos, index) => (
        <img
          key={index}
          src={pos.image} 
          alt={`Random Placeholder ${index}`}
          className={`dragonImage ${
            pos.image === '/dragon1.png'
              ? 'dragon1'
              : pos.image === '/dragon2.png'
              ? 'dragon2'
              : 'dragon3'
          }`}
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
            animation-duration: 12s;
          }
          .dragon2 {
            animation-duration: 14s;
          }
          .dragon3 {
            animation-duration: 16s;
          }
        `}
      </style>
    </Box>
  );
};

export default Home;

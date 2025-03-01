import React from 'react';
import { Document, Page } from 'react-pdf';
import { Box, Typography } from '@mui/material';

const ResumeDisplay = ({ pdfFile }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" gutterBottom>
        My Resume
      </Typography>
      <Document file={pdfFile}>
        <Page pageNumber={1} />
        <Page pageNumber={2} />
      </Document>
    </Box>
  );
};

export default ResumeDisplay;

import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Set the workerSrc to the path of your pdf.worker.min.js
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';
Worker.workerSrc = pdfWorker;

const ResumeDisplay = ({ file, size }) => {
  // Default to 100% width and height if size is not provided
  const { width = '100%', height = '100vh' } = size || {};

  return (
    <div style={{
      height: height, // Use the passed height or default to 100vh
      width: width,  // Use the passed width or default to 100%
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        height: '100%',
      }}>
        {file && file.type === 'application/pdf' && (
          <Worker>
            <Viewer
              fileUrl={URL.createObjectURL(file)}
              defaultScale={1.0} // Fit the page width
            />
          </Worker>
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;

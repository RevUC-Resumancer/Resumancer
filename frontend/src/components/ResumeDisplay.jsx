import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Set the workerSrc to the path of your pdf.worker.min.js
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';
Worker.workerSrc = pdfWorker;

const ResumeDisplay = ({ file }) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Resume PDF Viewer</h2>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {file && (
          <Worker>
            <Viewer fileUrl={URL.createObjectURL(file)} />
          </Worker>
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;

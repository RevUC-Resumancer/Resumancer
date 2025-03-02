import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Set the workerSrc to the path of your pdf.worker.min.js
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js';
Worker.workerSrc = pdfWorker;

const ResumeDisplay = ({ file, analysisResults }) => {
  const [highlights, setHighlights] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null);

  useEffect(() => {
    if (analysisResults) {
      const highlightData = analysisResults.map((result) => ({
        lineNumber: result.lineNumber,
        score: result.score,
        explanation: result.explanation,
      }));
      setHighlights(highlightData);
    }
  }, [analysisResults]);

  const getHighlightStyle = (lineNumber) => {
    const highlight = highlights.find((highlight) => highlight.lineNumber === lineNumber);
    if (!highlight) return {};

    let backgroundColor = 'transparent';
    if (highlight.score >= 8) {
      backgroundColor = 'rgba(0, 255, 0, 0.5)';
    } else if (highlight.score >= 5) {
      backgroundColor = 'rgba(255, 255, 0, 0.5)';
    } else {
      backgroundColor = 'rgba(255, 0, 0, 0.5)';
    }

    return {
      backgroundColor,
      position: 'relative',
    };
  };

  const getTooltipStyle = (lineNumber) => {
    return hoveredLine === lineNumber ? { display: 'block' } : { display: 'none' };
  };

  if (!file) return <div>Loading PDF...</div>;

  return (
    <div style={{ height: '80vh', width: '90vw', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Resume PDF Viewer</h2>
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {file && (
          <Worker>
            <Viewer
              fileUrl={URL.createObjectURL(file)}
              renderPage={(props) => {
                const { pageIndex } = props;
                return (
                  <div
                    key={pageIndex}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredLine(pageIndex)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    <div
                      style={getHighlightStyle(pageIndex)}
                    >
                      {highlights.map((highlight) => (
                        <div
                          key={highlight.lineNumber}
                          style={{
                            position: 'absolute',
                            left: '0',
                            top: `${highlight.lineNumber * 20}px`,
                            width: '100%',
                          }}
                        >
                          <span
                            style={{ ...getTooltipStyle(highlight.lineNumber), position: 'absolute', top: '20px' }}
                          >
                            {highlight.explanation}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Viewer {...props} />
                  </div>
                );
              }}
            />
          </Worker>
        )}
      </div>
    </div>
  );
};

export default ResumeDisplay;

import React from 'react';

const FeedbackDisplay = ({ feedbackData }) => {
  // Convert the string to an array of objects by parsing the feedbackData string
  const feedbackLines = feedbackData.split('\n').reduce((acc, line, index, array) => {
    // Check if the current line matches the pattern for Line #, Score, and Explanation
    if (line.startsWith('Line #:')) {
      const lineNumber = parseInt(line.split(':')[1].trim()); // Extract Line Number
      const scoreLine = array[index + 1]; // Next line contains Score
      const explanationLine = array[index + 2]; // Line after that contains Explanation

      // Extract the score and explanation
      const score = parseInt(scoreLine.split(':')[1].trim()); // Extract Score
      const explanation = explanationLine.split(':')[1].trim(); // Extract Explanation

      // Add to accumulator as an object
      acc.push({
        lineNumber,
        score,
        explanation,
      });
    }
    return acc;
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Resume Feedback</h2>
      {feedbackLines.length > 0 ? (
        <div>
          {feedbackLines.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: item.score >= 7 ? '#d4edda' : '#f8d7da', // Highlight based on score
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              }}
            >
              <div>
                <strong>Line #:</strong>
                <span>{item.lineNumber}</span>
              </div>
              <div>
                <strong>Score:</strong>
                <span>{item.score}</span>
              </div>
              <div>
                <strong>Explanation:</strong>
                <span
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    color: '#007bff',
                  }}
                  title={item.explanation} // Explanation shown as a hover tooltip
                >
                  {item.explanation.length > 50
                    ? `${item.explanation.substring(0, 50)}...` // Show a snippet
                    : item.explanation}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No feedback available</p>
      )}
    </div>
  );
};

export default FeedbackDisplay;

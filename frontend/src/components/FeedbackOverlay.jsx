import React from 'react';

const FeedbackDisplay = ({ feedbackData }) => {
  // Convert the string to an array of objects by parsing the feedbackData string
  const feedbackLines = feedbackData.split('\n').reduce((acc, line, index, array) => {
    // Check if the current line starts with "Line:"
    if (line.startsWith('Line:')) {
      const lineWords = line.split(':')[1].trim().split(' '); // Extract the 3 words after "Line:"
      const scoreLine = array[index + 1]; // Next line contains Score
      const explanationLine = array[index + 2]; // Line after that contains Explanation

      // Extract the score and explanation
      const score = parseInt(scoreLine.split(':')[1].trim()); // Extract Score
      const explanation = explanationLine.split(':')[1].trim(); // Extract Explanation

      // Add to accumulator as an object
      acc.push({
        lineWords, // Store the 3 words instead of a number
        score,
        explanation,
      });
    }
    return acc;
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        
    </div>
  );
};

export default FeedbackDisplay;

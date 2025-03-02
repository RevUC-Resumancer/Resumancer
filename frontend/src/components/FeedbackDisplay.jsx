import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  // Prepare data for the first bar chart (feedback scores for each line)
  const chartData1 = {
    labels: feedbackLines.map((_, index) => `Line ${index + 1}`), // Use the order numbers as labels
    datasets: [
      {
        label: 'Feedback Scores',
        data: feedbackLines.map((item) => item.score), // Use the score for the chart
        backgroundColor: feedbackLines.map((item) =>
          item.score >= 7 ? 'rgba(40, 167, 69, 0.7)' : 'rgba(220, 53, 69, 0.7)' // Color based on score
        ),
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the second bar chart (score distribution 1-10)
  const scoreDistribution = Array(10).fill(0); // Array to hold counts for scores 1-10

  feedbackLines.forEach((item) => {
    if (item.score >= 1 && item.score <= 10) {
      scoreDistribution[item.score - 1] += 1; // Tally each score
    }
  });

  const chartData2 = {
    labels: Array.from({ length: 10 }, (_, index) => (index + 1).toString()), // Labels for 1-10
    datasets: [
      {
        label: 'Score Distribution',
        data: scoreDistribution, // Count for each score
        backgroundColor: 'rgba(23, 162, 184, 0.7)', // Color for all bars
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Resume Feedback</h2>
      
      {/* Render the first bar chart (feedback scores for each line) */}
      <div style={{ marginBottom: '30px' }}>
        <Bar data={chartData1} options={{ responsive: true, plugins: { title: { display: true, text: 'Feedback Score Distribution' } } }} />
      </div>

      {/* Render the second bar chart (score distribution 1-10) */}
      <div style={{ marginBottom: '30px' }}>
        <Bar data={chartData2} options={{ responsive: true, plugins: { title: { display: true, text: 'Score Tally Distribution (1-10)' } } }} />
      </div>

      {feedbackLines.length > 0 ? (
        <div>
          {feedbackLines.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: '20px',
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: item.score >= 7 ? '#d4edda' : '#f8d7da', // Highlight based on score
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'} // Subtle hover effect
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                <strong>Line #: </strong>
                <span>{index + 1}</span>
              </div>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                <strong>Line Preview: </strong>
                <span>{item.lineWords.join(' ')}</span> {/* Fixed issue with lineWords */}
              </div>
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                <strong>Score: </strong>
                <span>{item.score}</span>
              </div>
              <div style={{ fontSize: '16px' }}>
                <strong>Explanation: </strong>
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

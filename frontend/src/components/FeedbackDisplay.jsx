import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Placeholder module for handling keywords
const KeywordModule = (keywords) => {
  // Placeholder logic, for now we just log the data
  console.log('Handling keyword data:', keywords);
};

const FeedbackDisplay = ({ feedbackData }) => {
  // Extract sentiment, tokenized text, entities, and key phrases
  const sentiment = feedbackData['sentiment_analysis'];  // This stores the sentiment analysis
  const tokenizedText = feedbackData['tokenized_text'];  // This stores the parsed tokenized text
  const tokenizedFeedback = feedbackData['tokenized_feedback'];  // This stores the parsed tokenized text

  // Parse entities from tokenizedText
  const entities = tokenizedText.entities.Entities.map(entity => {
    return {
      text: entity.Text, // The actual entity (word or phrase)
      type: entity.Type, // Type of entity (e.g., PERSON, LOCATION)
      score: entity.Score // Confidence score for the entity
    };
  });

  // Parse key phrases from tokenizedText
  const keyPhrases = tokenizedText.key_phrases.KeyPhrases.map(keyPhrase => {
    return {
      text: keyPhrase.Text, // The key phrase itself
      score: keyPhrase.Score // Confidence score for the key phrase
    };
  });

  // Get the top 5 most frequent key phrases (ignoring phrases with low confidence)
  const topKeyPhrases = keyPhrases
    .sort((a, b) => b.score - a.score)  // Sort by score descending
    .slice(0, 5)  // Get the top 5 phrases
    .map(keyPhrase => keyPhrase.text);  // Extract only the text for display

  // Pass the top key phrases to the placeholder module
  KeywordModule(topKeyPhrases);

  // Create a frequency map for the top 5 keywords
  const keywordFrequency = topKeyPhrases.reduce((acc, keyword) => {
    acc[keyword] = acc[keyword] ? acc[keyword] + 1 : 1;
    return acc;
  }, {});

  // Convert the frequency map into an array of labels and data
  const keywordLabels = Object.keys(keywordFrequency);
  const keywordData = Object.values(keywordFrequency);

  // Now parse the tokenized feedback for entities and their relevance scores
  const parsedFeedback = tokenizedFeedback.split(';').map(feedback => {
    const [entity, score] = feedback.split(',').map(str => str.trim());
    return { entity, score: parseInt(score) };
  }).sort((a, b) => b.score - a.score); // Sort by score in descending order

  // Calculate the average score
const scores = feedbackData['final_review'].split('\n\n').map(item => {
  const match = item.match(/Score: (\d+)/);
  return match ? parseInt(match[1]) : 0;
});
const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;

  // Combine data and options into one chartData1 object
  const chartData1 = {
    data: {
      labels: feedbackData['final_review'].split('\n\n').map(item => item.split('\n')[0].replace('Section: ', '')),  // Use section titles for labels
      datasets: [
        {
          label: 'Feedback Scores',
          data: scores,
          backgroundColor: feedbackData['final_review'].split('\n\n').map((item) => {
            const scoreMatch = item.match(/Score: (\d+)/);
            const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
            return score >= 7 ? 'rgba(40, 167, 69, 0.7)' : 'rgba(220, 53, 69, 0.7)';
          }),
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Average Score: ${averageScore.toFixed(2)}`, // Display average score as title
          font: {
            size: 18,
            weight: 'bold',
          },
        },
      },
    },
  };

  // Prepare data for the third bar chart (tokenized feedback entity scores)
  const chartData3 = {
    labels: parsedFeedback.map(item => item.entity),  // Labels are the entities
    datasets: [
      {
        label: 'Entity Relevance Scores',
        data: parsedFeedback.map(item => item.score),  // Relevance scores for the entities
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Resume Feedback</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <Bar data={chartData1} options={{ responsive: true, plugins: { title: { display: true, text: 'Feedback Score Distribution' } } }} />
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <Bar data={chartData3} options={{ responsive: true, plugins: { title: { display: true, text: 'Entity Relevance Score Distribution' } } }} />
      </div>
      
      {feedbackData['final_review'].split('\n\n').length > 0 ? (
  <div>
    {feedbackData['final_review']
  .replace(/\n/g, ' ') // Step 1: Replace \n with space
  .replace(/\*/g, '') // Step 2: Remove any '*' characters
  .trim() // Trim any extra spaces at the start/end
  .split(/(?=Section:|Score:|Explanation:)/) // Split on each keyword: "Section:", "Score:", "Explanation:"
  .map(part => part.trim()) // Trim spaces on each part
  .reduce((sections, part, index) => {
    if (part.startsWith('Section:')) {
      const sectionTitle = part.replace(/^Section:\s*/, '').trim();
      sections.push({ sectionTitle, score: null, explanation: null });
    } else if (part.startsWith('Score:')) {
      const score = parseInt(part.replace(/^Score:\s*/, '').trim()) || 'No score available';
      sections[sections.length - 1].score = score;
    } else if (part.startsWith('Explanation:')) {
      const explanation = part.replace(/^Explanation:\s*/, '').trim() || 'No explanation available';
      sections[sections.length - 1].explanation = explanation;
    }
    return sections;
  }, [])
  .map((section, index) => {
    const { sectionTitle, score, explanation } = section;

    return (
      <div
        key={index}
        style={{
          marginBottom: '20px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: score >= 7 ? '#f1f1f1' : '#f9e6e6',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          overflowWrap: 'break-word',
        }}
      >
        <div
          style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#333',
          }}
        >
          <strong>Section Title: </strong>
          <span>{sectionTitle}</span>
        </div>
        <div
          style={{
            fontSize: '16px',
            marginBottom: '15px',
            color: '#555',
          }}
        >
          <strong>Score: </strong>
          <span>{score}</span>
        </div>
        <div
          style={{
            fontSize: '16px',
            color: '#555',
            lineHeight: '1.6',
          }}
        >
          <strong>Explanation: </strong>
          <span
            style={{
              color: '',
              cursor: 'pointer',
              textDecoration: '',
              wordBreak: 'break-word',
              display: 'inline-block',
              maxWidth: '100%',
            }}
            title={explanation}
          >
            {explanation.slice(0, -1)}
          </span>
        </div>
      </div>
    );
  })}
</div>
) : (
  <p style={{ fontSize: '18px', color: '#555' }}>No feedback available</p>
)}



    </div>
  );
};

export default FeedbackDisplay;

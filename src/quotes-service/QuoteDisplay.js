import React from 'react';
import './quote-service.css';

const QuoteDisplay = ({ quote }) => {
  return (
    <div className="quote-section">
      <h3>Inspiring Quote</h3>
      <p>{quote}</p>
    </div>
  );
};

export default QuoteDisplay;
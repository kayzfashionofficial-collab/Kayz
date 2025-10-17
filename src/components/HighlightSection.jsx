import React from 'react';

const HighlightSection = () => (
  <div className="highlight-wrap">
    <h1 className="highlight-text">Jeans Collective.</h1>
    <svg className="scribble-circle" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="80" rx="160" ry="50" fill="none" stroke="#f6b98e" strokeWidth="8" />
      <ellipse cx="200" cy="80" rx="165" ry="55" fill="none" stroke="#f6b98e" strokeWidth="8" transform="rotate(-3 200 80)" />
    </svg>
  </div>
);

export default HighlightSection;

// src/components/CategorySlider/CategoryCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const encodedHandle = encodeURIComponent(category.handle);
    navigate(`/collection/${encodedHandle}`);
  };

  return (
    <div 
      className="category-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="img-box">
        <img src={category.image} alt={category.name} />
      </div>
      <div className="category-info">
        <h3>{category.name}</h3>
        <span className={`arrow ${isHovered ? 'hovered' : ''}`}>→</span>
      </div>
    </div>
  );
};

export default CategoryCard;

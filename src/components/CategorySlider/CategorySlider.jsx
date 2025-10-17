import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';

const CategorySlider = ({ categories, sliderRef, onSlideLeft, onSlideRight }) => (
  <section className="category-slider-wrapper">
    <button className="slider-btn left" onClick={onSlideLeft}>
      <ChevronLeft size={24} />
    </button>

    <div className="category-slider" ref={sliderRef}>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>

    <button className="slider-btn right" onClick={onSlideRight}>
      <ChevronRight size={24} />
    </button>
  </section>
);

export default CategorySlider;

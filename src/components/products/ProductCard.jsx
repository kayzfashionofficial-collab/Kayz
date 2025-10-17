// src/components/product/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const navigate = useNavigate();
  const defaultVariant = product.variants?.edges[0]?.node;

  const handleAddToCart = () => {
    if (defaultVariant) {
      addToCart(defaultVariant.id);
    }
  };

  const handleProductClick = () => {
    // Encode the product ID to handle special characters
    const encodedProductId = encodeURIComponent(product.id);
    navigate(`/product/${encodedProductId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(price.amount);
  };

  return (
    <div className="product-card">
      <div className="product-image" onClick={handleProductClick} style={{cursor: 'pointer'}}>
        <img
          src={product.featuredImage?.url || '/placeholder-image.jpg'}
          alt={product.featuredImage?.altText || product.title}
          loading="lazy"
        />
        <div className="product-overlay">
          <button 
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              // Implement quick view
            }}
          >
            Quick View
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 
          className="product-title" 
          onClick={handleProductClick}
          style={{cursor: 'pointer', color: '#2c5aa0'}}
        >
          {product.title}
        </h3>
        <p className="product-description">
          {product.description?.substring(0, 100)}...
        </p>
        
        <div className="product-pricing">
          <span className="product-price">
            {formatPrice(product.priceRange.minVariantPrice)}
          </span>
          {defaultVariant?.compareAtPrice && (
            <span className="product-compare-price">
              {formatPrice(defaultVariant.compareAtPrice)}
            </span>
          )}
        </div>
        
        <button
          className={`add-to-cart-btn ${loading ? 'loading' : ''}`}
          onClick={handleAddToCart}
          disabled={!defaultVariant?.availableForSale || loading}
        >
          {loading ? 'Adding...' : 
           !defaultVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
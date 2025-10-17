import React, { useState } from "react";
import "../assets/css/JeansCollective.css";

const JeansCollective = () => {
  // Replace these paths with your actual image URLs
  const images = [
    "https://thehangerpakistan.com/cdn/shop/files/E80C50DB-5123-47BD-AEB9-51E99D3F01CC.jpg?v=1750693788&width=600",
    "https://thehangerpakistan.com/cdn/shop/files/4AE1BFFB-2C29-4675-A065-9A267136FB76.jpg?v=1750693788&width=600",
    "https://thehangerpakistan.com/cdn/shop/files/4AE1BFFB-2C29-4675-A065-9A267136FB76.jpg?v=1750693788&width=600",
    "https://thehangerpakistan.com/cdn/shop/files/4AE1BFFB-2C29-4675-A065-9A267136FB76.jpg?v=1750693788&width=600",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="jeans-container">
      {/* Header */}
      <h1 className="jeans-title">
        <span>Jeans Collective.</span>
      </h1>

      {/* Tagline */}
      <p className="jeans-tagline">
        We studied, refined, and now it's here, premium denim, done right.
      </p>

      {/* Product Section */}
      <div className="jeans-gallery">
        {/* Thumbnails */}
        <div className="jeans-thumbnails">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`jeans-thumb ${
                selectedImage === img ? "active" : ""
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="jeans-main-image">
          <img src={selectedImage} alt="Selected jeans" />
        </div>
      </div>
    </div>
  );
};

export default JeansCollective;

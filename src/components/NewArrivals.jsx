// src/components/NewArrivals.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/NewArrivals.css";
import { storefrontClient } from "./lib/shopifyConfig";
import { COLLECTIONS_QUERY, PRODUCTS_BY_COLLECTION_QUERY } from "./lib/shopifyQueries";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewArrivals = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const sliderRef = useRef(null);
  const autoplayRef = useRef(null);

  // ✅ Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const { data } = await storefrontClient.query(COLLECTIONS_QUERY, { first: 10 });
        const fetched = data?.collections?.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          handle: edge.node.handle,
        })) || [];

        setCategories(fetched);
        if (fetched.length > 0) {
          setActiveCategory(fetched[0].handle);
          fetchProducts(fetched[0].handle);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // ✅ Fetch products
  const fetchProducts = async (handle) => {
    try {
      setCategoryLoading(true);
      const { data } = await storefrontClient.query(PRODUCTS_BY_COLLECTION_QUERY, { collectionHandle: handle, first: 10 });
      const edges = data?.collection?.products?.edges || [];
      const list = edges.map((edge) => ({
        id: edge.node.id,
        title: edge.node.title,
        images: edge.node.images.edges.map((img) => img.node.url),
        handle: edge.node.handle,
      }));

      setProducts((prev) => ({ ...prev, [handle]: list }));
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setCategoryLoading(false);
    }
  };

  // ✅ Autoplay
  useEffect(() => {
    if (!products[activeCategory]?.length) return;
    autoplayRef.current = setInterval(() => handleNext(), 4000);
    return () => clearInterval(autoplayRef.current);
  }, [activeCategory, products]);

  // ✅ Navigation
  const handleNext = () => {
    const items = products[activeCategory] || [];
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    const items = products[activeCategory] || [];
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  // ✅ Navigation to Product Detail
  const handleProductClick = (product) => {
    const encodedId = encodeURIComponent(product.id);
    navigate(`/product/${encodedId}`);
  };

  if (loading)
    return (
      <div className="newarrivals-container">
        <p className="loading-text">Loading New Arrivals...</p>
      </div>
    );

  return (
    <div className="newarrivals-container">
      {/* Category Tabs */}
      <div className="newarrivals-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.handle ? "active" : ""}`}
            onClick={() => {
              setActiveCategory(cat.handle);
              setCurrentSlide(0);
              if (!products[cat.handle]) fetchProducts(cat.handle);
            }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Product Slider */}
      <div
        className="slider-wrapper"
        ref={sliderRef}
        onMouseEnter={() => clearInterval(autoplayRef.current)}
        onMouseLeave={() => {
          autoplayRef.current = setInterval(() => handleNext(), 4000);
        }}
      >
        <button className="arrow-btn left" onClick={handlePrev}>
          <ChevronLeft size={22} />
        </button>

        <div className="slider">
          {categoryLoading ? (
            <p className="loading-text">Loading...</p>
          ) : products[activeCategory]?.length ? (
            products[activeCategory].map((item, index) => (
              <div
                className={`product-card ${index === currentSlide ? "active" : ""}`}
                key={item.id}
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                onClick={() => handleProductClick(item)}
              >
                <div className="image-wrapper">
                  <img src={item.images[0]} alt={item.title} className="main-image" />
                  {item.images[1] && <img src={item.images[1]} alt={item.title} className="hover-image" />}
                  <button className="options-btn">Choose Options</button>
                </div>
                <h4 className="product-title">{item.title}</h4>
              </div>
            ))
          ) : (
            <p className="loading-text">No products available.</p>
          )}
        </div>

        <button className="arrow-btn right" onClick={handleNext}>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default NewArrivals;

import React, { useState, useEffect } from "react";
import "../../assets/css/NewArrivals.css"; // Reuse or create ProductGrid.css
import { useNavigate } from "react-router-dom";
import { storefrontClient } from "../lib/shopifyConfig";
import {
  COLLECTIONS_QUERY,
  PRODUCTS_BY_COLLECTION_QUERY,
} from "../lib/shopifyQueries";
import Header from "../Layout/Header";
import Footer from "../Footer";

const ProductGrid = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState("");
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Collections (Categories)
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const { data } = await storefrontClient.query(COLLECTIONS_QUERY, {
          first: 10,
        });

        const fetchedCollections =
          data?.collections?.edges.map((edge) => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
          })) || [];

        setCollections(fetchedCollections);

        if (fetchedCollections.length > 0) {
          setActiveCollection(fetchedCollections[0].handle);
          fetchProducts(fetchedCollections[0].handle);
        }
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // ✅ Fetch Products by Collection
  const fetchProducts = async (handle) => {
    try {
      setCollectionLoading(true);
      const { data } = await storefrontClient.query(
        PRODUCTS_BY_COLLECTION_QUERY,
        { collectionHandle: handle, first: 12 }
      );

      const edges = data?.collection?.products?.edges || [];
      const fetchedProducts = edges.map((edge) => ({
        id: edge.node.id,
        title: edge.node.title,
        images: edge.node.images.edges.map((img) => img.node.url),
        price: edge.node.priceRangeV2?.minVariantPrice?.amount,
      }));

      setProducts((prev) => ({
        ...prev,
        [handle]: fetchedProducts,
      }));
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setCollectionLoading(false);
    }
  };

  // ✅ Navigate to Product Detail
  const handleProductClick = (product) => {
    const encodedId = encodeURIComponent(product.id);
    navigate(`/product/${encodedId}`);
  };

  // ✅ UI Rendering
  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading collections...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );

  return (
     <><Header />
    <div className="newarrivals-container">
      {/* Header */}
      <div className="product-grid-header">
        <h1>Shop the Latest</h1>
        <p>Explore trending collections from our store</p>
      </div>

      {/* Category Tabs */}
      <div className="newarrivals-tabs">
        {collections.map((col) => (
          <button
            key={col.id}
            className={`tab-btn ${
              activeCollection === col.handle ? "active" : ""
            }`}
            onClick={() => {
              setActiveCollection(col.handle);
              if (!products[col.handle]) fetchProducts(col.handle);
            }}
          >
            {col.title}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {collectionLoading ? (
          <p className="loading-text">Loading products...</p>
        ) : products[activeCollection]?.length ? (
          products[activeCollection].map((product) => {
            const mainImage = product.images?.[0];
            const hoverImage = product.images?.[1] || mainImage;

            return (

             <div
                key={product.id}
                className="product-card"
                onClick={() => handleProductClick(product)}
              >
                <div className="image-wrapper">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="main-image" />
                  <img
                    src={hoverImage}
                    alt={product.title}
                    className="hover-image" />
                  <button className="options-btn">Choose options</button>
                </div>

                <h3 style={{ marginTop: "10px", fontWeight: "500" }}>
                  {product.title}
                </h3>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                  {product.price ? `$${product.price}` : "Price not available"}
                </p>
              </div>
            );
          })
        ) : (
          <p className="loading-text">No products found.</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProductGrid;

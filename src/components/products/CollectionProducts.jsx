// src/pages/CollectionProducts.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { storefrontClient } from "../lib/shopifyConfig";
import { PRODUCTS_BY_COLLECTION_QUERY } from "../lib/shopifyQueries";
import { useCollections } from "../context/CollectionsContext";
import "../../assets/css/NewArrivals.css";
import Header from "../Layout/Header";
import Footer from "../Footer";



const CollectionProducts = () => {
  const { collectionHandle } = useParams();
  const navigate = useNavigate();
  const { collections } = useCollections();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (collectionHandle) fetchCollectionProducts();
  }, [collectionHandle]);

  const fetchCollectionProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, errors } = await storefrontClient.query(
        PRODUCTS_BY_COLLECTION_QUERY,
        { collectionHandle, first: 50 }
      );

      if (errors) throw new Error(errors[0].message);
      if (!data.collection) throw new Error("Collection not found");

      setCollection(data.collection);
      const formatted = data.collection.products.edges.map((e) => e.node);
      setProducts(formatted);
      setFiltered(formatted);
    } catch (err) {
      console.error("Error fetching collection products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (option) => {
    setSort(option);
    let sorted = [...products];

    switch (option) {
      case "price-low-high":
        sorted.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );
        break;
      case "price-high-low":
        sorted.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        );
        break;
      case "a-z":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        sorted = [...products];
    }

    setFiltered(sorted);
  };

  const handleProductClick = (id) => {
    const encodedProductId = encodeURIComponent(id);
    navigate(`/product/${encodedProductId}`);
  };

  if (loading)
    return (
      <div className="collection-loading">
        <p>Loading products...</p>
      </div>
    );

  if (error)
    return (
      <div className="collection-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/products")} className="back-button">
          Back to All Products
        </button>
      </div>
    );

  return (
    <><Header /><div className="newarrivals-container">
      {/* Breadcrumb */}
      {/* ===== Breadcrumb ===== */}
      <nav className="breadcrumb-nav">
        <button onClick={() => navigate("/")} className="breadcrumb-link">Home</button>
        <span className="breadcrumb-sep">›</span>
        <button onClick={() => navigate("/products")} className="breadcrumb-link">Shop</button>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{collection?.title}</span>
      </nav>

      {/* ===== Collection Header ===== */}
      <header className="collection-top">
        <div className="collection-text">
          <h1 className="collection-heading">{collection?.title}</h1>

          {collection?.description && (
            <p
              className="collection-subtext"
              dangerouslySetInnerHTML={{ __html: collection.description }} />
          )}

          <p className="collection-count">
            Showing <strong>{filtered.length}</strong> item{filtered.length !== 1 && "s"}
          </p>
        </div>

        {/* Sort Menu */}
        <div className="sort-dropdown">
          <label htmlFor="sort-select" className="sort-label">Sort by</label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="sort-select"
          >
            <option value="default">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="a-z">Name: A–Z</option>
            <option value="z-a">Name: Z–A</option>
          </select>
        </div>
      </header>


      {/* Products Grid */}
      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((product) => {
            const mainImage = product?.images?.edges?.length > 0
              ? product.images.edges[0].node.url
              : product.featuredImage?.url ||
              "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/placeholder-image.png?v=1669982950";

            const hoverImage = product?.images?.edges?.length > 1
              ? product.images.edges[1].node.url
              : mainImage;

            const altText = product.featuredImage?.altText || product.title;
            const price = product.priceRange?.minVariantPrice?.amount || "N/A";
            const currency = product.priceRange?.minVariantPrice?.currencyCode || "USD";
            const compareAt = product.variants?.edges?.[0]?.node?.compareAtPrice?.amount;

            return (
              <div key={product.id} className="product-card">
                <div
                  className="image-wrapper"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={mainImage}
                    alt={altText}
                    loading="lazy"
                    className="main-image" />
                  <img
                    src={hoverImage}
                    alt={altText}
                    loading="lazy"
                    className="hover-image" />
                  <button
                    className="options-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    } }
                  >
                    Choose options
                  </button>
                </div>

                <h3
                  className="product-title"
                  onClick={() => handleProductClick(product.id)}
                  style={{ cursor: "pointer" }}
                >
                  {product.title}
                </h3>

                <p className="product-price">
                  {compareAt ? (
                    <>
                      <span className="old-price">
                        {currency} {Number(compareAt).toFixed(2)}
                      </span>{" "}
                      <span className="new-price">
                        {currency} {Number(price).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    `${currency} ${Number(price).toFixed(2)}`
                  )}
                </p>
              </div>
            );
          })
        ) : (
          <div className="no-products">
            <h3>No products found in this collection</h3>
            <button
              onClick={() => navigate("/products")}
              className="view-all-btn"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CollectionProducts;



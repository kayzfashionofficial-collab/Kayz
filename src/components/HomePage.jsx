// src/pages/HomePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import "../../src/App.css";

// Import Components
import TopStrip from "../components/TopStrip";
import Navigation from "../components/Navigation/Navigation";
import MobileNav from "../components/Navigation/MobileNav";
import HeroSection from "../components/HeroSection";
import HeadlineMarquee from "../components/HeadlineMarquee";
import CategorySlider from "../components/CategorySlider/CategorySlider";
import CollectionHero from "../components/CollectionHero";
import JeansCollective from "../components/JeansCollective";
import NewArrivals from "../components/NewArrivals";
import FooterInfo from "../components/FooterInfo";
import Footer from "../components/Footer";
import { CollectionsProvider } from "../components/context/CollectionsContext";
import { storefrontClient } from "./lib/shopifyConfig";
import { COLLECTIONS_WITH_IMAGES_QUERY } from "./lib/shopifyQueries";
import Header from "./Layout/Header";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const marqueeRef = useRef(null);
  const sliderRef = useRef(null);

  

  // ✅ Fetch Shopify Collections Dynamically
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const { data, errors } = await storefrontClient.query(
          COLLECTIONS_WITH_IMAGES_QUERY,
          { first: 8 }
        );

        if (errors) console.error(errors);

        const fetchedCollections =
          data?.collections?.edges.map((edge) => ({
            id: edge.node.id,
            name: edge.node.title,
            handle: edge.node.handle,
            image:
              edge.node.image?.url ||
              "https://cdn.shopify.com/s/files/1/0680/4150/7113/files/default-image.jpg",
          })) || [];

        setCategories(fetchedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // ✅ Marquee Animation
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (marquee) {
      const marqueeContent = marquee.firstElementChild;
      const contentWidth = marqueeContent.offsetWidth;

      const animation = marqueeContent.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(-${contentWidth / 3}px)` },
        ],
        {
          duration: 20000,
          iterations: Infinity,
          easing: "linear",
        }
      );

      return () => animation.cancel();
    }
  }, []);

  // ✅ Slider Controls
  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

 

  return (
    <CollectionsProvider>
      <div className="app">
   
<Header/>
        <HeroSection />
        <HeadlineMarquee ref={marqueeRef} />

        {/* ✅ Dynamic Category Slider */}
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px" }}>
            Loading categories...
          </p>
        ) : (
          <CategorySlider
            categories={categories}
            sliderRef={sliderRef}
            onSlideLeft={slideLeft}
            onSlideRight={slideRight}
          />
        )}

        <CollectionHero />
        <JeansCollective />

        {/* ✅ NewArrivals is already dynamic */}
        <NewArrivals />

        <FooterInfo />
        <Footer />
      </div>
    </CollectionsProvider>
  );
};

export default HomePage;

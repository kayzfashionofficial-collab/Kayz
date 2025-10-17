// src/components/Navigation/MobileNav.jsx
import React, { useState } from "react";
import { X, ShoppingBag, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollections } from "../context/CollectionsContext";

const MobileNav = ({ isOpen, onClose, links }) => {
  const { collections, loading } = useCollections();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <>
      {/* Overlay for blur background */}
      <div
        className={`overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      ></div>

      <div className={`mobile-nav ${isOpen ? "active" : ""}`}>
        {/* Close Button */}
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Navigation Links */}
        <div className="mobile-links">
          {links.map((link, index) => (
            <div key={index} className="mobile-link-wrapper">
              {/* If link has dropdown */}
              {link.hasDropdown ? (
                <>
                  <button
                    className={`mobile-link ${link.isRed ? "red" : ""}`}
                    onClick={() => toggleDropdown(index)}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      size={18}
                      className={`dropdown-icon ${
                        openDropdown === index ? "rotate" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown */}
                  {openDropdown === index && (
                    <div className="mobile-dropdown">
                      {loading ? (
                        <p className="loading">Loading categories...</p>
                      ) : (
                        collections.map((collection) => (
                          <Link
                            key={collection.id}
                            to={`/collection/${collection.handle}`}
                            onClick={onClose}
                          >
                            {collection.title}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Normal links
                <Link
                  to={link.to || "/"}
                  className={`mobile-link ${link.isRed ? "red" : ""}`}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Cart Button at bottom */}
        <Link to="/cart" className="login-btn" onClick={onClose}>
          <ShoppingBag size={16} />
          <span>Cart</span>
        </Link>
      </div>
    </>
  );
};

export default MobileNav;

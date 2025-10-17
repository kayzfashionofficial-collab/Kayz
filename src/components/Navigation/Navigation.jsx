// src/components/Navigation/Navigation.jsx
import React, { useState } from "react";
import NavLink from "./NavLink";
import { ChevronDown } from "lucide-react";
import { useCollections } from "../context/CollectionsContext";
import { Link } from "react-router-dom";

const Navigation = ({ data, isMobileNavOpen, toggleMobileNav }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { collections, loading } = useCollections();

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src={data.logo.src} alt={data.logo.alt} height="60" />
      </div>

      {/* Nav Links */}
   <div className="nav-links">
  {data.navLinks.map((link, index) => (
    <div
      key={index}
      className={`nav-link-wrapper ${link.hasDropdown ? "dropdown" : ""}`}
      onMouseEnter={() => link.hasDropdown && setActiveDropdown(index)}
      onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
    >
      {link.hasDropdown ? (
        <button
          className={`nav-link-btn ${link.isRed ? "red" : ""}`}
          onClick={() => toggleDropdown(index)}
        >
          {link.label}
          <ChevronDown
            size={16}
            className={`dropdown-icon ${
              activeDropdown === index ? "rotate" : ""
            }`}
          />
        </button>
      ) : (
        <NavLink label={link.label} to={link.to} isRed={link.isRed} />
      )}

      {/* Dropdown menu */}
      {link.hasDropdown && activeDropdown === index && (
        <div className="dropdown-content">
          {loading ? (
            <p style={{ padding: "12px 24px" }}>Loading categories...</p>
          ) : (
            collections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collection/${collection.handle}`}
              >
                {collection.title}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  ))}
</div>



      {/* Right-side Icons */}
 <div className="nav-icons">
  {data.icons.map((icon, index) =>
    icon.to ? (
      <Link
        key={index}
        to={icon.to}
        className="icon-btn"
        aria-label={icon.label}
      >
        {icon.icon}
      </Link>
    ) : (
      <button
        key={index}
        className="icon-btn"
        aria-label={icon.label}
        onClick={icon.onClick}
      >
        {icon.icon}
      </button>
    )
  )}
</div>

      {/* Mobile Menu Toggle */}
      <button
        className={`toggle-btn ${isMobileNavOpen ? "active" : ""}`}
        onClick={toggleMobileNav}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
};

export default Navigation;

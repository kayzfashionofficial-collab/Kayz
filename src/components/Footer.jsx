import React, { useEffect, useRef, useState } from "react";
import "../assets/css/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerRef = useRef(null);
  const [isFooterActive, setIsFooterActive] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const [openSections, setOpenSections] = useState({
    quickLinks: false,
    about: false,
  });

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    let hasAppeared = false;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAppeared) {
          setIsFooterActive(true);
          hasAppeared = true; // Trigger animation only once
          observer.disconnect(); // Stop observing once triggered
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);


  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200)); // simulate delay
    setStatus("success");
    setEmail("");

    setTimeout(() => setStatus("idle"), 4000);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer
      ref={footerRef}
      className={`footer ${isFooterActive ? "active-footer visible" : ""}`}
      role="contentinfo"
    >

      <div className="footer-inner">
        {/* Left Side */}
        <div className="footer-left">
          {/* Quick Links */}
          <div className="footer-section">
            <h3
              className="collapsible-title"
              onClick={() => toggleSection("quickLinks")}
            >
              Quick Links
              <span className="chevron">{openSections.quickLinks ? "−" : "+"}</span>
            </h3>
            <nav
              className={`collapsible-content ${openSections.quickLinks ? "open" : ""
                }`}
            >
              <ul>
                <li><Link to="/About-us" className="footer-link">About Us</Link></li>
                <li><Link to="/faqs" className="footer-link">FAQ’S</Link></li>
                <li><Link to="/return-policy" className="footer-link">Exchange & Returns</Link></li>
                <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/Contact-us" className="footer-link">Contact</Link></li>
              </ul>

            </nav>
          </div>

          {/* About Section */}
          <div className="footer-section">
            <h3
              className="collapsible-title"
              onClick={() => toggleSection("about")}
            >
              About Us
              <span className="chevron">{openSections.about ? "−" : "+"}</span>
            </h3>
            <div
              className={`collapsible-content ${openSections.about ? "open" : ""
                }`}
            >
              <p className="about-description">
                Welcome to <strong>KAYZ</strong> — your go-to destination for
                trendy and affordable fashion. We’re a small but passionate team
                focused on bringing you quality styles that make you feel confident
                and comfortable every day.
              </p>
              <div className="contact-info">
                <a
                  href="mailto:kayzfashionofficial@gmail.com"
                  className="contact-email"
                >
                  kayzfashionofficial@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          <h2 className="newsletter-heading">
            Join the crew, stay ahead of others
            <br /> with regular updates.
          </h2>

          <form onSubmit={handleSubscribe} className="newsletter-form">
            <div className="newsletter-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                required
                className="newsletter-input"
                disabled={status !== "idle"}
              />
              <button
                type="submit"
                className={`arrow-btn ${status}`}
                disabled={status !== "idle" || !email}
              >
                {status === "loading" ? "..." : status === "success" ? "✓" : "→"}
              </button>
            </div>

            {status === "success" && (
              <p className="success-message">Welcome aboard! 🎉</p>
            )}
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} kAYZ. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

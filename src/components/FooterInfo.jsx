import React from "react";
import "../assets/css/FooterInfo.css";
import { FaHeadset, FaBoxOpen, FaShieldAlt } from "react-icons/fa";

const FooterInfo = () => {
  return (
    <div className="footer-info-container">
      <div className="footer-info-item">
        <FaHeadset className="footer-icon" />
        <div className="footer-text">
          <h4>Customer service</h4>
          <p>
            You can share your queries or comments by calling  +92 345 8694008 or
            by E-mailing us at <br />
            <a href="mailto:kayzfashionofficial@gmail.com">
              kayzfashionofficial@gmail.com
            </a>
          </p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-info-item">
        <FaBoxOpen className="footer-icon" />
        <div className="footer-text">
          <h4>Fast Shipping</h4>
          <p>Get Fast shipping on every order orders</p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-info-item">
        <FaShieldAlt className="footer-icon" />
        <div className="footer-text">
          <h4>Secure payment</h4>
          <p>Your payment information is processed securely</p>
        </div>
      </div>
    </div>
  );
};

export default FooterInfo;

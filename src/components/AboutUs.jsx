import React from "react";
import '../assets/css/AboutUs.css'
import Header from "./Layout/Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
    const navigate = useNavigate();
  return (
    <><Header /><section className="about-container bg-white py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">About Us</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                  Welcome to <strong>KAYZ</strong> — your go-to destination for
                  trendy and affordable fashion. We’re a small but passionate team
                  focused on bringing you quality styles that make you feel confident
                  and comfortable every day.
              </p>

              <p className="text-gray-700 mb-4 leading-relaxed">
                  Every product in our collection is carefully selected with love and
                  attention to detail. Whether it’s your everyday essentials or
                  something special, we aim to make shopping simple, fun, and reliable.
              </p>

              <p className="text-gray-700 leading-relaxed">
                  As a growing brand, we value every customer and every order. Thank you
                  for supporting our journey — we’re excited to grow with you!
              </p>

              <div className="mt-8">
                  <button className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition-all" onClick={()=> navigate('/products')}>
                      Shop Now
                  </button>
              </div>
          </div>
      </section>
      <Footer/></>
  );
}

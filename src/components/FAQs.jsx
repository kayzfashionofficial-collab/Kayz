import React, { useState } from "react";
import "../assets/css/FAQs.css";

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "You can browse our products, add your favorite items to the cart, and proceed to checkout. Simply fill in your details and payment method to complete the purchase.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept a variety of payment options, including debit/credit cards, Cash on Delivery (COD), and bank transfers — depending on your region.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Orders are usually delivered within 3–7 business days. Delivery times may vary based on your location.",
    },
    {
      question: "Can I return or exchange an item?",
      answer:
        "Yes! We have a 15-day return policy. Items must be unused, unworn, and in their original packaging with tags attached. Please contact us at kayzfashionofficial@gmail.com before sending anything back.",
    },
    {
      question: "What should I do if I receive a damaged item?",
      answer:
        "Please inspect your order upon arrival and contact us immediately with pictures. We’ll arrange a replacement or refund right away.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within Pakistan. However, international shipping will be available soon.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach out anytime at kayzfashionofficial@gmail.com — we’re happy to assist!",
    },
  ];

  return (
    <section className="faq-container">
      <div className="faq-inner">
        <h1>Frequently Asked Questions</h1>
        <p className="faq-subtext">
          Find answers to common questions about orders, returns, and shipping.
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

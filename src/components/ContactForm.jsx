import React, { useRef } from "react";
import emailjs from "emailjs-com";
import '../assets/css/ContactUs.css'
import Header from "./Layout/Header";
import Footer from "./Footer";

export default function ContactUs() {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAIL_SERVICE,   
        import.meta.env.VITE_TEMPLATE,  
        form.current,
        import.meta.env.VITE_PUBLIC_KEY  
      )
      .then(
        (result) => {
          alert(" Message sent successfully!");
        },
        (error) => {
          console.error(error.text);
          alert(" Something went wrong. Try again!");
        }
      );

    e.target.reset();
  };

  return (
    <><Header /><section className="contact-container">
          <div className="contact-inner">
              <div className="contact-left">
                  <h2>Get in Touch</h2>
                  <p>
                      Have a question, feedback, or just want to say hello?
                      Fill out the form and we’ll get back to you as soon as possible.
                  </p>

                  <ul className="contact-info">
                      <li><strong>Phone:</strong> +92 345 8694008</li>
                      <li><strong>Email:</strong> kayzfashionofficial@gmail.com</li>
                      <li><strong>Location:</strong> Block 4 A Gulshan-e-Iqbal, A/76 , Karachi, 75300, PK</li>
                  </ul>
              </div>

              <div className="contact-right">
                  <form ref={form} onSubmit={sendEmail} className="contact-form">
                      <div className="form-group">
                          <label>Your Name</label>
                          <input type="text" name="name" placeholder="Enter your name" required />
                      </div>

                      <div className="form-group">
                          <label>Your Email</label>
                          <input type="email" name="email" placeholder="Enter your email" required />
                      </div>

                      <div className="form-group">
                          <label>Message</label>
                          <textarea name="message" rows="5" placeholder="Write your message..." required />
                      </div>

                      <button type="submit" className="send-btn">Send Message</button>
                  </form>
              </div>
          </div>
      </section>
      <Footer/>
      </>
  );
}

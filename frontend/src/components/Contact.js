// src/components/Contact.js
import React from 'react';

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <h1>Get in Touch</h1>
      <p>I'd love to hear from you! Feel free to reach out.</p>
      <form
        action="https://formsubmit.co/tejeswarreddybeduthuri@gmail.com"
        method="POST"
        className="contact-form"
      >
        <input type="text" name="name" placeholder="Your Name" required className="input" />
        <input type="email" name="email" placeholder="Your Email" required className="input" />
        <textarea name="message" placeholder="Your Message" required className="input" rows="5" />
        <button type="submit" className="btn">Send Message</button>
      </form>
      <footer style={{ marginTop: "30px", color: "#888" }}>
        <p>&copy; 2025 GREEN CODERS | Email: <a href="mailto:tejeswarreddybeduthuri@gmail.com">greencoderes@gmail.com</a></p>
      </footer>
    </section>
  );
}

export default Contact;

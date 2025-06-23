import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h2>About Us</h2>
      <section className="mission-section">
        <h3>Our Mission</h3>
        <p>
          At Travel Companion, we are passionate about making travel accessible and enjoyable for everyone. Our mission is to inspire and assist travelers in discovering new destinations, cultures, and experiences with ease and confidence.
        </p>
        <p>
          Founded by a team of avid explorers, we understand the excitement and challenges of planning a trip. That's why we've created a platform that offers comprehensive travel information, personalized recommendations, and secure booking options—all in one place.
        </p>
      </section>
      <section className="team-section">
        <h3>Our Team</h3>
        <div className="team-members">
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80" alt="Team Member 1" />
            <p>Alex Johnson</p>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80" alt="Team Member 2" />
            <p>Maria Rodriguez</p>
            <p>Head of Marketing</p>
          </div>
          <div className="team-member">
            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" alt="Team Member 3" />
            <p>James Lee</p>
            <p>Lead Developer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

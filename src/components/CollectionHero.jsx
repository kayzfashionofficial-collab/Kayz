import React from 'react';
import FancyButton from './FancyButton';

const CollectionHero = () => (
  <section className="collection-hero">
    <div className="hero-image">
      <img 
        src="https://thehangerpakistan.com/cdn/shop/files/04133C31-945D-4EAE-A1C5-9C3C284D76E2_41b6fbdb-9de8-4fed-96e0-a6d5ec3bb7a6.jpg?v=1757778934&width=1080"
        alt="Summer Collection"
      />
    </div>

    <div className="hero-text">
      <h2>Summer End Collection / S-25 LIVE NOW!</h2>
      <p>
        Crafted knits, fresh denim, fresh fits in trousers, airy linens, new co-ord sets, jerseys, essentials 
        and graphic tees—this collection took time, built with intention, and made premium yet affordable.
      </p>
      <p>
        Kayz was born from a passion to break boundaries in fashion. What started as an idea has grown into 
        a family of 100,000+ customers and over a million units sold nationwide—building trust and strong 
        connections with our community.
      </p>
      <p>
        Our vision is to redefine fashion with creativity, quality, and authenticity at its core. We're excited 
        to announce that <strong>Summer End collection is now live</strong>.
      </p>

      <FancyButton />
    </div>
  </section>
);

export default CollectionHero;

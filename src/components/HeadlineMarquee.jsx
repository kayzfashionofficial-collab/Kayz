import React from 'react';

const HeadlineMarquee = React.forwardRef((props, ref) => (
  <section className="headline-marquee" ref={ref}>
    <div className="marquee-track">
      <span>NEW SEASON • LUXURY ESSENTIALS • EXCLUSIVE COLLECTION • </span>
      <span>NEW SEASON • LUXURY ESSENTIALS • EXCLUSIVE COLLECTION • </span>
      <span>NEW SEASON • LUXURY ESSENTIALS • EXCLUSIVE COLLECTION • </span>
    </div>
  </section>
));

export default HeadlineMarquee;

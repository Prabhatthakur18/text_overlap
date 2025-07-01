import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">

      {/* Top Center Heading */}
      <div className="main-heading">
        Personalise your car accessories the way you like!
      </div>

      {/* Section 1 */}
      <div className="section dark">
        <div className="text-content align-top">
          <h2 className="title">
            <Sparkles size={30} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Transform Your Drive
          </h2>
<p>
  Elevate your journey with custom headrests tailored to your style. Premium stitching, personalized initials — crafted for comfort and elegance. Whether you're heading to the office or on a weekend getaway, our accessories provide unmatched luxury, ergonomic support, and a personal touch that sets your car interior apart. It's not just comfort — it's a statement.
  <br /><br />
  Every headrest is made with handpicked materials, precision-finished by skilled artisans to ensure long-lasting quality. Choose from a range of embroidery styles, textures, and colors to reflect your personality. Our products are not mass-produced — they’re made-to-order, just for you.
  <br /><br />
  Give your car the makeover it deserves. Feel the difference every time you lean back. Style, comfort, and identity — now stitched into every mile.
</p>
          <div className="tags">
            <span><CheckCircle size={14} /> Premium Comfort</span>
            <span><CheckCircle size={14} /> Custom Embroidery</span>
            <span><CheckCircle size={14} /> Luxury Finish</span>
          </div>
        </div>
        <div className="media-content align-top">
          <img src="/models/ChatGPT Image Jun 30, 2025, 12_56_54 PM.png" alt="Custom Headrest" />
        </div>
      </div>

      {/* Section 2 */}
      <div className="section light">
       <div className="media-content video-wrapper">
  <video
    className="video-element"
    src="/models/WhatsApp Video 2025-06-30 at 18.56.02_d3df19a1.mp4"
    autoPlay
    loop
    muted
    playsInline
  />
</div>

        <div className="text-content">
          <h2 className="title">
            <Sparkles size={28} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Craftsmanship You Can Feel
          </h2>
         <p>
  From raw materials to finished luxury — our accessories go through expert detailing and precision cuts to meet the highest standards. Each product is shaped by skilled hands, ensuring perfection in every stitch and seam. We don’t just build accessories — we sculpt experiences meant to last.
  <br /><br />
  Our process combines traditional craftsmanship with modern precision, resulting in flawless form, rich texture, and reliable durability. Whether it’s the feel of the fabric or the finesse in the embroidery, every element reflects our obsession with detail.
  <br /><br />
  What you get isn’t just a product — it’s a masterpiece made to elevate your drive, every single day.
</p>
          <div className="tags">
            <span><CheckCircle size={14} /> Handcrafted</span>
            <span><CheckCircle size={14} /> Attention to Detail</span>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="cta-button">
        <button onClick={() => navigate('/personalise')}>
          Go Personalise <ArrowRight size={16} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
        </button>
      </div>
    </div>
  );
}

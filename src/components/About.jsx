import { siteConfig } from "../siteConfig";

const ABOUT_IMAGE = "/assets/blog-4-570x456.jpg";

export function About() {
  return (
    <section className="rk-section rk-about-premium" id="about">
      <div className="rk-container rk-about-premium__grid">
        <div className="rk-about-premium__image-stack">
          <img src={ABOUT_IMAGE} alt="Titan Forge Facility" className="rk-about-premium__img-main" />
          <div className="rk-about-premium__glass-badge">
             <strong>10+</strong>
             <span>Years of Excellence</span>
          </div>
        </div>
        <div className="rk-about-premium__content">
          <span className="rk-section-eyebrow">{siteConfig.content.aboutSubtitle}</span>
          <h2 className="rk-section-title rk-text-glow">{siteConfig.content.aboutTitle}</h2>
          <p className="rk-about-premium__desc">{siteConfig.content.aboutBody}</p>
          <ul className="rk-pricing-features rk-about-premium__features">
            <li>State-of-the-Art Equipment Arrays</li>
            <li>Elite Level Coaching Staff</li>
            <li>Uncompromising Training Environment</li>
          </ul>
          <a href="#classes" className="rk-button rk-button--primary">EXPLORE FACILITY</a>
        </div>
      </div>
    </section>
  );
}

import { siteConfig } from "../siteConfig";

const HERO_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop";

export function Hero() {
  const { content } = siteConfig;
  return (
    <section className="rk-hero-fullscreen" id="top">
      <div className="rk-hero-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="rk-hero-overlay"></div>
      </div>
      
      <div className="rk-hero-fullscreen__content">
        <span className="rk-hero__eyebrow">{content.heroSubtitle}</span>
        <h1 className="rk-hero__massive-headline">
          FORGE<br/><span className="rk-hero__huge-accent">YOUR</span><br/>LEGACY
        </h1>
        <p className="rk-hero__desc">
          {content.heroDescription}
        </p>

        <div className="rk-hero__actions">
          <a className="rk-button rk-button--primary" href="#classes">
            {content.heroButtonLabel}
          </a>
          <a className="rk-button rk-button--ghost" href="#contact">
            {content.heroSecondaryButtonLabel}
          </a>
        </div>
      </div>

      <div className="rk-hero-fullscreen__floating-stats">
        <div className="rk-stat-item">
          <strong>1,200+</strong>
          <span>Elite Members</span>
        </div>
        <div className="rk-stat-divider"></div>
        <div className="rk-stat-item">
          <strong>24/7</strong>
          <span>Access Facility</span>
        </div>
      </div>
    </section>
  );
}

import { siteConfig } from "../siteConfig";

const HERO_IMAGE = "/gymate/assets/home2-1.jpg";
const HERO_SHAPE = "/gymate/assets/shape-32.png";

export function Hero() {
  return (
    <section className="rk-hero" id="top">
      <div className="rk-hero__content">
        <span className="rk-hero__eyebrow">{siteConfig.hero.eyebrow}</span>
        <h1>{siteConfig.hero.title}</h1>
        <p>{siteConfig.hero.description}</p>

        <div className="rk-hero__actions">
          <a className="rk-button rk-button--primary" href={siteConfig.hero.primaryCta.href}>
            {siteConfig.hero.primaryCta.label}
          </a>
          <a className="rk-button rk-button--ghost" href={siteConfig.hero.secondaryCta.href}>
            {siteConfig.hero.secondaryCta.label}
          </a>
        </div>

        <ul className="rk-hero__highlights" aria-label="Key improvements">
          {siteConfig.hero.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>

      <div className="rk-hero__visual" aria-hidden="true">
        <img className="rk-hero__shape" src={HERO_SHAPE} alt="" />
        <div className="rk-hero__card">
          <div className="rk-hero__card-badge">Gym Website Demo</div>
          <img className="rk-hero__image" src={HERO_IMAGE} alt="Gym website visual" />
          <div className="rk-hero__card-copy">
            <strong>React-first top section</strong>
            <span>Better navigation, cleaner branding, and more controlled mobile behavior.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

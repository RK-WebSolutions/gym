import { siteConfig } from "../siteConfig";

export function Membership() {
  const { plans } = siteConfig.content;
  
  return (
    <section className="rk-section rk-membership" id="pricing">
      <div className="rk-container">
        <div className="rk-section-header">
          <span className="rk-section-eyebrow">Commit Or Quit</span>
          <h2 className="rk-section-title">{siteConfig.content.membershipTitle}</h2>
          <p>No hidden fees. No compromises. Just elite facilities for those serious about their goals.</p>
        </div>
        <div className="rk-pricing-cards">
          <div className="rk-pricing-card">
            <h3>{plans.basic}</h3>
            <p className="rk-price">{plans.basicPrice}</p>
            <p className="rk-yearly-price">{plans.basicYearlyPrice}</p>
            <ul className="rk-pricing-features">
              <li>Open Gym Access</li>
              <li>Standard Equipment Usage</li>
              <li>Locker Room Access</li>
            </ul>
            <a href="#contact" className="rk-button rk-button--ghost">CHOOSE TIER</a>
          </div>
          <div className="rk-pricing-card rk-pricing-card--popular">
            <div className="rk-pricing-badge">🔥 MOST POPULAR</div>
            <h3>{plans.standard}</h3>
            <p className="rk-price">{plans.standardPrice}</p>
            <p className="rk-yearly-price">{plans.standardYearlyPrice}</p>
            <ul className="rk-pricing-features">
              <li>Everything in Initiate</li>
              <li>Group HIIT Classes</li>
              <li>Sauna & Cold Plunge Access</li>
            </ul>
            <a href="#contact" className="rk-button rk-button--primary">BECOME AN ATHLETE</a>
          </div>
          <div className="rk-pricing-card">
            <h3>{plans.premium}</h3>
            <p className="rk-price">{plans.premiumPrice}</p>
            <p className="rk-yearly-price">{plans.premiumYearlyPrice}</p>
            <ul className="rk-pricing-features">
              <li>Everything in Athlete</li>
              <li>1x Weekly Personal Coaching</li>
              <li>Nutrition & Macro Planning</li>
            </ul>
            <a href="#contact" className="rk-button rk-button--ghost">CHOOSE TIER</a>
          </div>
        </div>
      </div>
    </section>
  );
}

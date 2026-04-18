import { siteConfig } from "../siteConfig";

export function Testimonials() {
  const { content } = siteConfig;

  return (
    <section className="rk-section rk-testimonials" id="blog">
      <div className="rk-container">
        <div className="rk-section-header">
          <span className="rk-section-eyebrow">Iron Echoes</span>
          <h2 className="rk-section-title">{content.testimonialsTitle}</h2>
        </div>
        <div className="rk-testimonials-grid">
          <div className="rk-testimonial-card">
            <span className="rk-quote-mark">"</span>
            <p>{content.testimonial1}</p>
            <strong>- Arun Kumar</strong>
          </div>
          <div className="rk-testimonial-card rk-testimonial-card--featured">
            <span className="rk-quote-mark rk-quote-mark--primary">"</span>
            <p>{content.testimonial2}</p>
            <strong>- Priya S</strong>
          </div>
          <div className="rk-testimonial-card">
            <span className="rk-quote-mark">"</span>
            <p>{content.testimonial3}</p>
            <strong>- Vikram R</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

import { siteConfig } from "../siteConfig";

export function Contact() {
  return (
    <section className="rk-section rk-contact-premium" id="contact">
      <div className="rk-container">
        <div className="rk-section-header">
          <span className="rk-section-eyebrow">Enlist Today</span>
          <h2 className="rk-section-title">Take The First Step</h2>
          <p>Drop into our facility or secure your consultation with our elite coaching staff.</p>
        </div>
        
        <div className="rk-contact-premium__grid">
          <div className="rk-contact-premium__info">
            <div className="rk-contact-premium__card">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <strong>HEADQUARTERS</strong>
                <span>{siteConfig.content.location}</span>
              </div>
            </div>
            <div className="rk-contact-premium__card">
              <i className="fas fa-phone-alt"></i>
              <div>
                <strong>DIRECT LINE</strong>
                <span>{siteConfig.content.phone}</span>
              </div>
            </div>
            <div className="rk-contact-premium__card">
              <i className="fas fa-envelope"></i>
              <div>
                <strong>DIGITAL COMM</strong>
                <span>{siteConfig.content.email}</span>
              </div>
            </div>
          </div>

          <form className="rk-contact-premium__form" onSubmit={(e) => e.preventDefault()}>
            <div className="rk-form-group">
              <input type="text" placeholder="GIVEN NAME" required />
            </div>
            <div className="rk-form-group">
              <input type="email" placeholder="EMAIL ADDRESS" required />
            </div>
            <div className="rk-form-group">
              <select required defaultValue="">
                <option value="" disabled>SELECT OBJECTIVE</option>
                <option value="powerlifting">Powerlifting</option>
                <option value="conditioning">Conditioning</option>
                <option value="facility_tour">Facility Tour</option>
              </select>
            </div>
            <div className="rk-form-group">
              <textarea placeholder="ADDITIONAL INTEL..." rows="4"></textarea>
            </div>
            <button type="submit" className="rk-button rk-button--primary rk-button--full">INITIATE CONTACT</button>
          </form>
        </div>
      </div>
    </section>
  );
}

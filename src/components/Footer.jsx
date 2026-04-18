import { siteConfig } from "../siteConfig";

const configuredSocialLinks = Object.entries(siteConfig.socialLinks).filter(
  ([, url]) => url.trim(),
);

// Map network name to fontawesome class
const iconMap = {
  facebook: 'fab fa-facebook-f',
  instagram: 'fab fa-instagram',
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin-in',
  youtube: 'fab fa-youtube'
};

export function Footer() {
  const { content } = siteConfig;
  return (
    <footer className="rk-site-footer-premium" id="contact-footer">
      <div className="rk-site-footer-premium__content">
        <div className="rk-site-footer-premium__brand">
          <h2>TITAN FORGE</h2>
          <p>{content.footerTagline}</p>
        </div>

        <div className="rk-site-footer-premium__links">
          <strong>NAVIGATION</strong>
          <a href="#about">About</a>
          <a href="#classes">Programs</a>
          <a href="#pricing">Membership</a>
          <a href="#trainers">Trainers</a>
        </div>

        <div className="rk-site-footer-premium__socials-container">
          <strong>TRANSMISSIONS</strong>
          {configuredSocialLinks.length > 0 && (
            <div className="rk-site-footer-premium__socials" aria-label="Social links">
              {configuredSocialLinks.map(([network, url]) => (
                <a key={network} href={url} rel="noreferrer" target="_blank" className="rk-social-icon">
                  <i className={iconMap[network.toLowerCase()] || 'fas fa-link'}></i>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rk-site-footer-premium__bottom">
        <span>{content.footerCopyright}</span>
        <a href="#top" className="rk-back-to-top">RETURN TO APEX <i className="fas fa-arrow-up"></i></a>
      </div>
    </footer>
  );
}

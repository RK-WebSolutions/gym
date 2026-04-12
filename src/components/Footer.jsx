import { siteConfig } from "../siteConfig";

const configuredSocialLinks = Object.entries(siteConfig.socialLinks).filter(
  ([, url]) => url.trim(),
);

export function Footer() {
  return (
    <footer className="rk-site-footer" id="contact">
      <div className="rk-site-footer__content">
        <div className="rk-site-footer__copy">
          <span className="rk-site-footer__eyebrow">{siteConfig.footer.eyebrow}</span>
          <h2>{siteConfig.footer.title}</h2>
          <p>{siteConfig.footer.description}</p>
        </div>

        <div className="rk-site-footer__actions">
          <a className="rk-button rk-button--footer" href={siteConfig.footer.ctaHref}>
            {siteConfig.footer.ctaLabel}
          </a>

          {configuredSocialLinks.length > 0 && (
            <div className="rk-site-footer__socials" aria-label="Social links">
              {configuredSocialLinks.map(([network, url]) => (
                <a key={network} href={url} rel="noreferrer" target="_blank">
                  {network}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rk-site-footer__bottom">
        <span>{siteConfig.footer.copyright}</span>
        <a href="#top">Back To Top</a>
      </div>
    </footer>
  );
}

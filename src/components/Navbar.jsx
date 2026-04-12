import { useState } from "react";
import { siteConfig } from "../siteConfig";

function NavLinks({ className = "", onNavigate = () => {} }) {
  return (
    <nav aria-label="Primary" className={className}>
      {siteConfig.navigation.map((item) => (
        <a
          key={item.href}
          className="rk-nav__link"
          href={item.href}
          onClick={onNavigate}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <header className="rk-site-header">
      <div className="rk-site-header__announcement">
        <p>{siteConfig.announcement.text}</p>
        <a className="rk-site-header__announcement-link" href={siteConfig.announcement.ctaHref}>
          {siteConfig.announcement.ctaLabel}
        </a>
      </div>

      <div className="rk-site-header__bar">
        <a className="rk-brand" href="#top" onClick={handleNavigate}>
          <span className="rk-brand__name">{siteConfig.brand.name}</span>
          <span className="rk-brand__label">{siteConfig.brand.label}</span>
        </a>

        <NavLinks className="rk-nav rk-nav--desktop" />

        <div className="rk-site-header__actions">
          <a className="rk-button rk-button--header" href={siteConfig.announcement.ctaHref}>
            {siteConfig.announcement.ctaLabel}
          </a>
          <button
            aria-controls="rk-mobile-menu"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="rk-menu-toggle"
            onClick={() => setIsOpen((value) => !value)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`rk-mobile-menu${isOpen ? " is-open" : ""}`}
        id="rk-mobile-menu"
      >
        <NavLinks className="rk-nav rk-nav--mobile" onNavigate={handleNavigate} />
        <a
          className="rk-button rk-button--mobile"
          href={siteConfig.announcement.ctaHref}
          onClick={handleNavigate}
        >
          {siteConfig.announcement.ctaLabel}
        </a>
      </div>
    </header>
  );
}

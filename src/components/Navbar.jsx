import { useState } from "react";
import { siteConfig } from "../siteConfig";

const navigation = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Programs" },
  { href: "#pricing", label: "Membership" },
  { href: "#trainers", label: "Trainers" },
  { href: "#blog", label: "Testimonials" },
  { href: "#contact", label: "Contact" }
];

function NavLinks({ className = "", onNavigate = () => {} }) {
  return (
    <nav aria-label="Primary" className={className}>
      {navigation.map((item) => (
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
  const { content } = siteConfig;

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <header className="rk-site-header">
      <div className="rk-site-header__bar">
        <a className="rk-brand" href="#top" onClick={handleNavigate}>
          <span className="rk-brand__name">TITAN FORGE</span>
        </a>

        <NavLinks className="rk-nav rk-nav--desktop" />

        <div className="rk-site-header__actions">
          <a className="rk-button rk-button--header" href="#contact">
            {content.headerButtonLabel}
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
          href="#contact"
          onClick={handleNavigate}
        >
          {content.headerButtonLabel}
        </a>
      </div>
    </header>
  );
}

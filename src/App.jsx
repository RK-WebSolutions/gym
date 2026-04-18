import { useEffect } from "react";
import { siteConfig } from "./siteConfig";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Programs } from "./components/Programs";
import { Membership } from "./components/Membership";
import { Trainers } from "./components/Trainers";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  useEffect(() => {
    document.title = siteConfig.pageTitle;
  }, []);

  return (
    <div className="rk-profile-layout">
      <Navbar />
      <main>
        <Hero />
        <About />
        <div className="rk-section-divider"></div>
        <Programs />
        <div className="rk-section-divider"></div>
        <Membership />
        <div className="rk-section-divider"></div>
        <Trainers />
        <div className="rk-section-divider"></div>
        <Testimonials />
        <div className="rk-section-divider"></div>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

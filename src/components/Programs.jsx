import { siteConfig } from "../siteConfig";

export function Programs() {
  const programsData = [
    { id: 1, title: 'Strength & Conditioning', image: '/assets/c1-570x456.jpg', desc: 'Build foundational raw strength with elite powerlifting and weightlifting cycles.' },
    { id: 2, title: 'High-Intensity Tactical', image: '/assets/c3-570x456.jpg', desc: 'Metabolic conditioning designed to push your cardiovascular capacity to the limits.' },
    { id: 3, title: 'Athlete Development', image: '/assets/c4-570x456.jpg', desc: 'Sport-specific training, agility drills, and explosive plyometrics for peak performance.' }
  ];

  return (
    <section className="rk-section rk-programs" id="classes">
      <div className="rk-container">
        <div className="rk-section-header">
          <span className="rk-section-eyebrow">Discover Your Limits</span>
          <h2 className="rk-section-title">{siteConfig.content.programsTitle}</h2>
          <p>We do not believe in routine. We believe in highly structured, periodized training cycles engineered to break plateaus and forge iron discipline.</p>
        </div>
        
        <div className="rk-programs-grid">
          {programsData.map(prog => (
            <div key={prog.id} className="rk-program-card rk-program-card--image">
              <div className="rk-program-card__cover" style={{ backgroundImage: `url(${prog.image})` }}></div>
              <div className="rk-program-card__content">
                <h3>{prog.title}</h3>
                <p>{prog.desc}</p>
                <a href="#contact" className="rk-program-link">JOIN DIVISION <span className="rk-arrow">→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

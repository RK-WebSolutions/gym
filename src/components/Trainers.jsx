import { siteConfig } from "../siteConfig";

export function Trainers() {
  const trainersData = [
    { id: 1, name: 'Marcus Vance', role: 'Head of Powerlifting', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, name: 'Elena Rostova', role: 'Elite Conditioning', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, name: 'David Thorne', role: 'Combat & Tactical', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop' }
  ];

  return (
    <section className="rk-section rk-trainers" id="trainers">
      <div className="rk-container">
        <div className="rk-section-header">
          <span className="rk-section-eyebrow">The Architects</span>
          <h2 className="rk-section-title">{siteConfig.content.trainersTitle}</h2>
          <p>{siteConfig.content.trainersBody}</p>
        </div>

        <div className="rk-trainers-grid">
          {trainersData.map(trainer => (
            <div key={trainer.id} className="rk-trainer-card" style={{ backgroundImage: `url(${trainer.image})` }}>
              <div className="rk-trainer-card__overlay">
                <h3>{trainer.name}</h3>
                <span>{trainer.role}</span>
                <div className="rk-trainer-socials">
                  <i className="fab fa-instagram"></i>
                  <i className="fab fa-twitter"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

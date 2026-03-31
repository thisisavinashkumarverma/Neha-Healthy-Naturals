import './InfoSection.css'

function InfoSection({ id, label, title, description, items, accent = 'warm' }) {
  return (
    <section id={id} className={`info-section info-section--${accent}`}>
      <div className="info-section__heading">
        <span>{label}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="info-section__grid">
        {items.map((item) => (
          <article key={item.title} className="info-section__card">
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default InfoSection

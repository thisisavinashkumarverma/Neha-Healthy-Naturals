import './HeroShowcase.css'

const spiceNotes = [
  'Stone-ground turmeric',
  'Farm-direct chili flakes',
  'Pure coriander blends',
  'Export-grade garam masala',
]

function HeroShowcase({ onLoginClick, onSignupClick, products = [] }) {
  const heroImages = [products[0]?.image, products[1]?.image, products[2]?.image].filter(Boolean)

  return (
    <section className="hero-showcase">
      <div className="hero-showcase__content">
        <span className="hero-showcase__eyebrow">Freshly sourced | Naturally powerful | Trusted quality</span>
        <h1>Premium spices crafted for homes, stores, and modern healthy kitchens.</h1>
        <p>
          NEHA HEALTHY NATURALS brings together bold flavor, clean processing, and single-vendor reliability for
          customers who want authentic spices with a professional buying experience.
        </p>

        <div className="hero-showcase__actions">
          <button type="button" onClick={onSignupClick}>
            Create Account
          </button>
          <button type="button" className="hero-showcase__ghost" onClick={onLoginClick}>
            Explore Dashboard
          </button>
        </div>

        <div className="hero-showcase__notes">
          {spiceNotes.map((note) => (
            <span key={note}>{note}</span>
          ))}
        </div>
      </div>

      <div className="hero-showcase__card">
        <div className="hero-showcase__collage" aria-hidden="true">
          {heroImages.map((image, index) => (
            <img
              key={image}
              className={`hero-showcase__art hero-showcase__art--${index + 1}`}
              src={image}
              alt=""
            />
          ))}
        </div>
        <div className="hero-showcase__spotlight">
          <p>Best Seller Mix</p>
          <strong>Royal Spice Collection</strong>
          <span>Visuals pulled from the NHN catalog, not placeholders.</span>
        </div>

        <div className="hero-showcase__stats">
          <article>
            <strong>98%</strong>
            <span>Customer repeat rate</span>
          </article>
          <article>
            <strong>24h</strong>
            <span>Dispatch promise</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>Single-vendor quality control</span>
          </article>
        </div>
      </div>
    </section>
  )
}

export default HeroShowcase

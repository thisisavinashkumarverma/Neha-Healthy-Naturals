import BrandHeader from '../../components/brand-header/BrandHeader'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './LandingPage.css'

const collectionCards = [
  {
    title: 'Signature Daily Essentials',
    description: 'Turmeric, coriander, chili, and cumin in a clean retail-ready range built for repeat purchase.',
    accent: 'gold',
  },
  {
    title: 'Chef-Led Premium Blends',
    description: 'Refined garam masala and specialty roasting profiles for elevated home and hospitality cooking.',
    accent: 'copper',
  },
  {
    title: 'Wellness-Led Kitchen Staples',
    description: 'Spices positioned for healthy cooking, gifting, and premium pantry stocking.',
    accent: 'sage',
  },
]

const experiencePoints = [
  'Single-vendor quality control across sourcing, blending, and packing',
  'Premium packaging designed for shelves, gifting, and digital storefronts',
  'Fast support for individual customers, wholesale buyers, and institutional orders',
]

const milestones = [
  { title: 'Sourced with care', text: 'We begin with aroma, freshness, and visual quality at the ingredient level.' },
  { title: 'Crafted for trust', text: 'Every blend is positioned for consistency, clarity, and premium presentation.' },
  { title: 'Delivered beautifully', text: 'From storefront visuals to dispatch, the experience stays polished end to end.' },
]

const testimonials = [
  {
    quote: 'The brand looks premium and the spice presentation feels shelf-ready from the first screen.',
    author: 'Retail Buying Team',
  },
  {
    quote: 'A stronger landing page for conversion, trust, and premium product storytelling.',
    author: 'Marketplace Consultant',
  },
]

function LandingPage({ products = [], onNavigate, onLoginClick, onSignupClick, isAuthenticated = false }) {
  const heroImages = [
    products[0]?.image,
    products[1]?.image,
    products[2]?.image,
    products[3]?.image,
  ].filter(Boolean)

  return (
    <main className="landing-page">
      <div className="landing-page__container">
        <BrandHeader
          onNavigate={onNavigate}
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
          isAuthenticated={isAuthenticated}
        />

        <section className="landing-page__hero">
          <div className="landing-page__hero-copy">
            <span className="landing-page__eyebrow">NEHA HEALTHY NATURALS</span>
            <h1>Premium spices, elevated branding, and a storefront built to feel genuinely professional.</h1>
            <p>
              This landing page is designed as a dedicated brand experience for NEHA HEALTHY NATURALS, showcasing a
              premium single-vendor spice company with strong visual trust, refined storytelling, and clear commerce
              intent.
            </p>

            <div className="landing-page__hero-actions">
              {isAuthenticated ? (
                <>
                  <button type="button" className="landing-page__primary-button" onClick={() => onNavigate('home')}>
                    Go to Store
                  </button>
                  <button type="button" className="landing-page__secondary-button" onClick={() => onNavigate('home-orders')}>
                    View My Orders
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="landing-page__primary-button" onClick={onSignupClick}>
                    Start Shopping
                  </button>
                  <button type="button" className="landing-page__secondary-button" onClick={onLoginClick}>
                    Customer Login
                  </button>
                </>
              )}
            </div>

            <div className="landing-page__hero-trust">
              <span>Single Vendor</span>
              <span>Premium Packaging</span>
              <span>Healthy Kitchen Focus</span>
            </div>
          </div>

          <div className="landing-page__hero-visual">
            <div className="landing-page__hero-collage">
              {heroImages.map((image, index) => (
                <img
                  key={image}
                  className={`landing-page__hero-art landing-page__hero-art--${index + 1}`}
                  src={image}
                  alt=""
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="landing-page__jar landing-page__jar--front">
              <small>Best Seller</small>
              <strong>Royal Spice Collection</strong>
              <p>Curated blend series built from the actual NHN catalog visuals.</p>
            </div>
            <div className="landing-page__jar landing-page__jar--back">
              <span>Turmeric Gold</span>
              <span>Royal Garam Masala</span>
              <span>Kashmiri Chili</span>
            </div>
          </div>
        </section>

        <section className="landing-page__stats">
          <article>
            <strong>24h</strong>
            <span>Premium dispatch experience</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>Single-vendor consistency</span>
          </article>
          <article>
            <strong>6+</strong>
            <span>Hero-ready spice categories</span>
          </article>
          <article>
            <strong>98%</strong>
            <span>Repeat customer confidence</span>
          </article>
        </section>

        <section className="landing-page__collections">
          <div className="landing-page__section-head">
            <span>Curated Collections</span>
            <h2>Guests can explore the full NHN collection before signing in.</h2>
            <p>
              We surface all core products on the public landing page, but protected actions like adding items to cart
              will guide customers into login first.
            </p>
          </div>

          <div className="landing-page__collection-grid">
            {collectionCards.map((card) => (
              <article key={card.title} className={`landing-page__collection-card landing-page__collection-card--${card.accent}`}>
                <strong>{card.title}</strong>
                <p>{card.description}</p>
              </article>
            ))}
          </div>

          <div className="landing-page__guest-products">
            {products.map((product) => (
              <article key={product.id} className="landing-page__guest-card">
                <div className="landing-page__guest-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="landing-page__guest-content">
                  <span>{product.badge}</span>
                  <h3>{product.name}</h3>
                  <p>{product.shortDescription}</p>
                  <div className="landing-page__guest-meta">
                    <strong>Rs {product.price}</strong>
                    <small>{product.size}</small>
                  </div>
                  <button
                    type="button"
                    className="landing-page__primary-button"
                    onClick={isAuthenticated ? () => onNavigate('home') : onLoginClick}
                  >
                    {isAuthenticated ? 'Open Store to Add' : 'Login to Add to Cart'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-page__story">
          <div className="landing-page__story-card">
            <span>Why NHN</span>
            <h2>Designed for trust, visual polish, and premium conversion.</h2>
            <ul>
              {experiencePoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="landing-page__timeline">
            {milestones.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-page__testimonials">
          <div className="landing-page__section-head">
            <span>Brand Impression</span>
            <h2>A polished first impression that feels premium on desktop and mobile.</h2>
          </div>
          <div className="landing-page__testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.author} className="landing-page__testimonial-card">
                <p>"{item.quote}"</p>
                <strong>{item.author}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-page__cta">
          <div>
            <span>Ready to Enter the Store?</span>
            <h2>Move from premium brand discovery into a full NHN ecommerce experience.</h2>
          </div>
          <div className="landing-page__cta-actions">
            {isAuthenticated ? (
              <>
                <button type="button" className="landing-page__primary-button" onClick={() => onNavigate('home')}>
                  Enter Storefront
                </button>
                <button type="button" className="landing-page__secondary-button" onClick={() => onNavigate('home-orders')}>
                  Open My Orders
                </button>
              </>
            ) : (
              <>
                <button type="button" className="landing-page__primary-button" onClick={onSignupClick}>
                  Create Customer Account
                </button>
                <button type="button" className="landing-page__secondary-button" onClick={onLoginClick}>
                  Login to Dashboard
                </button>
              </>
            )}
          </div>
        </section>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="landing" />
      </div>
    </main>
  )
}

export default LandingPage

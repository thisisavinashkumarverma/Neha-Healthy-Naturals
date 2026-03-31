import './SiteFooter.css'

function SiteFooter({ onNavigate, footerRoutePrefix = 'landing' }) {
  const companyLinks =
    footerRoutePrefix === 'home'
      ? [
          { label: 'About Us', route: 'home-brand' },
          { label: 'Products', route: 'home-collections' },
          { label: 'Contact', route: 'home-care' },
        ]
      : [
          { label: 'About Us', route: 'landing-story' },
          { label: 'Products', route: 'landing-collections' },
          { label: 'Contact', route: 'landing-contact' },
        ]
  return (
    <footer className="site-footer">
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <span>NHN</span>
          <div>
            <strong>NEHA HEALTHY NATURALS</strong>
            <p>Premium single-vendor spices crafted for healthy kitchens, retail shelves, and trusted daily cooking.</p>
          </div>
        </div>

        <div className="site-footer__links">
          <div>
            <h3>Company</h3>
            {companyLinks.map((link) => (
              <button
                key={link.route}
                type="button"
                className="site-footer__nav-button"
                onClick={() => onNavigate?.(link.route)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div>
            <h3>Support</h3>
            <a href="mailto:support@nhnspices.com">support@nhnspices.com</a>
            <a href="tel:+919000045678">+91 90000 45678</a>
            <span>Mon - Sat, 9:00 AM - 7:00 PM</span>
          </div>

          <div>
            <h3>Promise</h3>
            <span>Fresh sourcing</span>
            <span>Professional packing</span>
            <span>Reliable single-vendor quality</span>
          </div>
        </div>
      </div>

      <div className="site-footer__copyright">
        <p>Copyright © 2026 Neha Healthy Naturals. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default SiteFooter

import { useState } from 'react'
import './StoreNavbar.css'

function StoreNavbar({
  user,
  onLogout,
  onOpenAdmin,
  onNavigate,
  secondaryActionLabel = 'Admin Panel',
  cartCount = 0,
  orderCount = 0,
  showCartShortcut = true,
  showOrdersShortcut = true,
  showSecondaryAction = true,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const links = [
    { label: 'Collections', route: 'home-collections' },
    { label: 'About the Brand', route: 'home-brand' },
    { label: 'Customer Care', route: 'home-care' },
  ]

  const handleNavigate = (route) => {
    onNavigate?.(route)
    setIsMenuOpen(false)
  }

  const handleLogoClick = () => {
    onNavigate?.('landing')
    setIsMenuOpen(false)
  }

  const handleSecondaryAction = () => {
    onOpenAdmin?.()
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    onLogout?.()
    setIsMenuOpen(false)
  }

  return (
    <header className="store-navbar">
      <div className="store-navbar__top">
        <button type="button" className="store-navbar__brand-button" onClick={handleLogoClick}>
          <div className="store-navbar__brand">
          <span>NHN</span>
          <div>
            <strong>NEHA HEALTHY NATURALS</strong>
            <p>Welcome {user.name}</p>
          </div>
          </div>
        </button>

        <button
          type="button"
          className="store-navbar__toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`store-navbar__menu ${isMenuOpen ? 'store-navbar__menu--open' : ''}`}>
        <nav className="store-navbar__links">
          {links.map((link) => (
            <button key={link.route} type="button" className="store-navbar__link" onClick={() => handleNavigate(link.route)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="store-navbar__actions">
          {showOrdersShortcut && (
            <button type="button" className="store-navbar__orders-button" onClick={() => handleNavigate('home-orders')}>
              My Orders
              <span className="store-navbar__cart-count">{orderCount}</span>
            </button>
          )}
          {showCartShortcut && (
            <button type="button" className="store-navbar__cart-button" onClick={() => handleNavigate('home-cart')}>
              Cart
              <span className="store-navbar__cart-count">{cartCount}</span>
            </button>
          )}
          {showSecondaryAction && (
            <button type="button" onClick={handleSecondaryAction}>
              {secondaryActionLabel}
            </button>
          )}
          <button type="button" className="store-navbar__logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default StoreNavbar

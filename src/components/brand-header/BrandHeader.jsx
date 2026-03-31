import { useState } from 'react'
import './BrandHeader.css'

function BrandHeader({
  onLoginClick,
  onSignupClick,
  onNavigate,
  isAuthenticated = false,
  compact = false,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const links = isAuthenticated ? [{ label: 'Our Collection', route: 'landing-collections' }] : []

  const handleNavigate = (route) => {
    onNavigate?.(route)
    setIsMenuOpen(false)
  }

  const handleLogoClick = () => {
    onNavigate?.('landing')
    setIsMenuOpen(false)
  }

  const handleLogin = () => {
    onLoginClick?.()
    setIsMenuOpen(false)
  }

  const handleSignup = () => {
    onSignupClick?.()
    setIsMenuOpen(false)
  }

  const handleStoreHome = () => {
    onNavigate?.('home')
    setIsMenuOpen(false)
  }

  const handleMyOrders = () => {
    onNavigate?.('home-orders')
    setIsMenuOpen(false)
  }

  return (
    <header className={`brand-header ${compact ? 'brand-header--compact' : ''}`}>
      <div className="brand-header__top">
        <button type="button" className="brand-header__logo-button" onClick={handleLogoClick}>
          <div className="brand-header__logo">
          <span className="brand-header__mark">NHN</span>
          <div>
            <strong>NEHA HEALTHY NATURALS</strong>
            <p>Single-vendor premium spices marketplace</p>
          </div>
          </div>
        </button>

        <button
          type="button"
          className="brand-header__toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`brand-header__menu ${isMenuOpen ? 'brand-header__menu--open' : ''}`}>
        <nav className="brand-header__nav">
          {links.map((link) => (
            <button
              key={link.route}
              type="button"
              className="brand-header__nav-link"
              onClick={() => handleNavigate(link.route)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="brand-header__actions">
          {isAuthenticated ? (
            <>
              <button type="button" className="brand-header__button brand-header__button--ghost" onClick={handleMyOrders}>
                My Orders
              </button>
              <button type="button" className="brand-header__button" onClick={handleStoreHome}>
                Store Home
              </button>
            </>
          ) : (
            <>
              <button type="button" className="brand-header__button brand-header__button--ghost" onClick={handleLogin}>
                Login
              </button>
              <button type="button" className="brand-header__button" onClick={handleSignup}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default BrandHeader

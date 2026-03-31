import { useState } from 'react'
import BrandHeader from '../../components/brand-header/BrandHeader'
import AuthCard from '../../components/auth-card/AuthCard'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './LoginPage.css'

function LoginPage({ onBack, onLogin, onSignupLink, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  })

  const fields = [
    { name: 'name', label: 'Username', type: 'text', placeholder: 'Enter your name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' },
    {
      name: 'role',
      label: 'Login As',
      type: 'select',
      options: [
        { value: 'customer', label: 'Customer' },
        { value: 'admin', label: 'Admin' },
      ],
    },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(formData)
  }

  return (
    <main className="login-page">
      <div className="login-page__container">
        <BrandHeader onNavigate={onNavigate} onLoginClick={() => {}} onSignupClick={onSignupLink} compact />

        <div className="login-page__panel">
          <div className="login-page__content">
            <span>Customer and Admin Access</span>
            <h2>Secure entry for premium spice buyers and store managers.</h2>
            <p>
              Sign in as a customer to reach the storefront home page, or use admin mode to open the single-vendor
              management dashboard.
            </p>
          </div>

          <AuthCard
            title="Login to NHN"
            subtitle="Access your spice shopping experience or the admin control center."
            fields={fields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Login Now"
            helperText="Don’t have an account?"
            helperActionLabel="Create one"
            onHelperAction={onSignupLink}
            onBack={onBack}
          />
        </div>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="landing" />
      </div>
    </main>
  )
}

export default LoginPage

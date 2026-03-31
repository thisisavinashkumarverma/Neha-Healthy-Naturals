import { useState } from 'react'
import BrandHeader from '../../components/brand-header/BrandHeader'
import AuthCard from '../../components/auth-card/AuthCard'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './SignupPage.css'

function SignupPage({ onBack, onSignup, onLoginLink, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
    { name: 'phone', label: 'Phone Number', type: 'text', placeholder: 'Enter your phone number' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Create a password' },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSignup(formData)
  }

  return (
    <main className="signup-page">
      <div className="signup-page__container">
        <BrandHeader onNavigate={onNavigate} onLoginClick={onLoginLink} onSignupClick={() => {}} compact />

        <div className="signup-page__panel">
          <AuthCard
            title="Create your account"
            subtitle="Join the NHN spice marketplace and unlock the personalized customer home page."
            fields={fields}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Create Account"
            helperText="Already have an account?"
            helperActionLabel="Login"
            onHelperAction={onLoginLink}
            onBack={onBack}
          />

          <div className="signup-page__content">
            <span>Healthy Spice Membership</span>
            <h2>Beautiful onboarding for customers who want trusted, natural spices.</h2>
            <p>
              The signup flow is designed to feel premium and simple, then sends the customer directly to a welcoming
              home page with product, about, and contact sections.
            </p>
          </div>
        </div>

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="landing" />
      </div>
    </main>
  )
}

export default SignupPage

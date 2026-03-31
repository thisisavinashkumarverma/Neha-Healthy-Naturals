import BrandHeader from '../../components/brand-header/BrandHeader'
// import AuthCard from '../../components/auth-card/AuthCard'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './LoginPage.css'

function LoginPage({ onBack, onLogin, onSignupLink, onNavigate }) {
  const formData = {
    name: '',
    email: '',
    password: '',
    role: 'customer',
  }

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

  const handleSubmit = (event) => {
    event.preventDefault()
    const submittedData = Object.fromEntries(new FormData(event.currentTarget).entries())
    onLogin(submittedData)
  }

  return (
    <main className="login-page">
      <div className="login-page__container">
        <BrandHeader onNavigate={onNavigate} onLoginClick={() => {}} onSignupClick={onSignupLink} compact />

       

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="landing" />
      </div>
    </main>
  )
}

export default LoginPage

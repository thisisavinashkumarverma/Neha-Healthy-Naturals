import BrandHeader from '../../components/brand-header/BrandHeader'
// import AuthCard from '../../components/auth-card/AuthCard'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './SignupPage.css'
import { useAuth } from '../../context/AuthContext'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
function SignupPage({ onBack, onLoginLink, onNavigate }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState();
  const [password, setPass] = useState();
  const {reqOtpContext,verifyOtpContext,signupContext, otpStatus} = useAuth();

  const navigate = useNavigate()
  

  const handleOtp = async(e)=>{
    e.preventDefault();
    await reqOtpContext({email});
    localStorage.setItem("email", email);


  }
  const handleEmail = (e)=>{
  setEmail(e.target.value);
 
 
  }

  const handleOtpInput=(e)=>{
    setOtp(e.target.value)
  }


  const passHandle=(e)=>{
    setPass(e.target.value);
  }

  const handleSignup =async(e)=>{
    e.preventDefault();
    await signupContext(password);
    

  }

  const payload ={
    email:email,
    recOtp: otp
  }
  const handleVerify=async(e)=>{
    e.preventDefault();
    const res =await verifyOtpContext(payload)
    console.log(res);
  }


  useEffect(()=>{
    const email =localStorage.getItem("email");
   
    if(email){
      setEmail(email);
  
    console.log(email)

   
  }
  },[])



  return (
    <main className="signup-page">
      <div className="signup-page__container">
        <BrandHeader onNavigate={onNavigate} onLoginClick={onLoginLink} onSignupClick={() => {}} compact />

        <div className="signup-page__panel">
          <div className='form-container'>
         <form  >
          <label >Email</label>
          <input type='email'className="email" name='email' value={email.email} onChange={handleEmail}></input>
          <button type='button'onClick={handleOtp}>request OTP</button>
          <label>OTP</label>
          <input type='text' placeholder='enter otp' name='recOtp' value={otp.recOtp} onChange={handleOtpInput}></input>
          <button type='submit' onClick={handleVerify}>verify</button>
          <label>Password</label>
          <input type='password' onChange={passHandle}></input>
          <p>{otpStatus}</p>
          <button type='button' onClick={handleSignup}>Create Account</button>
         </form>

         <p>Already have an acc? <a onClick={()=>navigate("/login")}>Login</a></p>
         </div>
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

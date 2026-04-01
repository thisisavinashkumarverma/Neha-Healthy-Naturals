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
  const {reqOtpContext,verifyOtpContext,signupContext, otpStatus, sendOTP, verify} = useAuth();

  const navigate = useNavigate()
  console.log(sendOTP)

  const handleOtp = async(e)=>{
    e.preventDefault();
    await reqOtpContext({email});
    localStorage.setItem("email", email);


  }
  const handleEmail = (e)=>{
  setEmail(e.target.value);
 
 
  }

  let isEmailEmpty = email.trim()=='';

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
         <form onSubmit={handleOtp} >
          <label >Email</label>
          <input type='email'className="email" name='email' value={email.email} onChange={handleEmail} required={true}></input>
          <button disabled={isEmailEmpty}>request OTP</button>
          </form>

        <form onSubmit={handleVerify}>
          <label>OTP</label>
          <input type='text' placeholder='enter otp' disabled={sendOTP} name='recOtp'  value={otp.recOtp} onChange={handleOtpInput} required></input>
          <button disabled={sendOTP}>verify</button>
        </form>

        <form onSubmit={handleSignup}>
          <label>Password</label>
          <input type='password' onChange={passHandle} required></input>
          <p>{otpStatus}</p>
          <button disabled={verify} >Create Account</button>
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

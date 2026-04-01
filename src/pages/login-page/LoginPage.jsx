import BrandHeader from '../../components/brand-header/BrandHeader'
// import AuthCard from '../../components/auth-card/AuthCard'
import SiteFooter from '../../components/site-footer/SiteFooter'
import './LoginPage.css'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
function LoginPage({  onSignupLink, onNavigate }) {

  const {login, otpStatus} = useAuth();
const { register, handleSubmit, formState:{errors, isSubmitting},}= useForm();
const navigate = useNavigate();
const location = useLocation();

const onSubmit = async(data)=>{
  const isSuccess = await login(data);

  if (!isSuccess) {
    return;
  }

  const redirectPath = location.state?.from?.pathname || "/store";
  navigate(redirectPath, { replace: true });


}

  return (
    <main className="login-page">
      <div className="login-page__container">
        <BrandHeader onNavigate={onNavigate} onLoginClick={() => {}} onSignupClick={onSignupLink} compact />
        <div className='form-container'>
         <form onSubmit={handleSubmit(onSubmit)} >
          <label >Email</label>
          <input type='email'className="email" name='email' 
            {...register("email", {
              required:"email is required"
            })}
          ></input>
          {errors.email && <p style={{color:"red"}}>{errors.email.message}</p>}
          
          <label>Password</label>
          <input type='password' 
          {...register("password",{
            required: "password is required"
          })}
          
        
          ></input>
          {errors.password && <p style={{color:"red"}}>{errors.password.message}</p>}
          <p>{otpStatus}</p>
          <button  >Create Account</button>
          {isSubmitting ? "Loging in ..." : ""}
         </form>

         <p>Already have an acc? <a onClick={()=>navigate("/login")}>Login</a></p>
         </div>
       

        <SiteFooter onNavigate={onNavigate} footerRoutePrefix="landing" />
      </div>
    </main>
  )
}

export default LoginPage

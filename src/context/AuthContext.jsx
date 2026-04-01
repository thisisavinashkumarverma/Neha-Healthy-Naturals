import { createContext, useState, useContext, useEffect } from 'react'


import * as authService from '../services/authservieces'


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setLogin] = useState(() => Boolean(localStorage.getItem('token')))
  const [otpStatus, setOtpStatus] = useState('')
  const [sendOTP, setSent] = useState(true);
  const [verify, setVerify]= useState(true);
  const [profile, setProfile] = useState([])

  const [signupToken, setToken] = useState(() => localStorage.getItem('signToken') || '');

  useEffect(() => {
    if (signupToken) {
      localStorage.setItem('signToken', signupToken)
      return
    }

    localStorage.removeItem('signToken')
  }, [signupToken])

  async function reqOtpContext(formData) {

    try {
      setOtpStatus('')
      const res = await authService.reqOtp(formData)
     
      if(!res.success){
        console.log(res)
        setOtpStatus(res.message );
        setSent(false);
        return;
      }
      
   
        
    } catch (err) {
      console.error(err.message)
      setOtpStatus(err.message+ ' or invalid email')
    }

  }

  async function verifyOtpContext(formData){
      try{
        const res = await authService.verifyotp(formData);
        if(!res.success){
          setOtpStatus(res.message);
          return;
        }
        localStorage.setItem('signToken', res.signupToken);
        setToken(res.signupToken);
        setVerify(false);
        console.log(res.signupToken);

        localStorage.removeItem('email')
        
        setOtpStatus(res.message)


      }catch(err){
        console.log(err.message)

        setOtpStatus(err.message)
      }
  }

  async function signupContext(password){
    try{

      const payload={
        signupToken : signupToken,
        password:password
      }
      const res = await authService.signup(payload);
      console.log(res)
      if(!res.success){
        setOtpStatus(res.message);
        console.error(res);
        return;
      }
      setToken('')
      setOtpStatus(res.message);
      
      
    }catch(err){
      console.error(err);
      setOtpStatus(err.message)
    }
    
  }



  async function login(formData){
    try{
      setOtpStatus('');
      const res = await authService.login(formData);

     

      if(!res.success){
        console.error(res.message);
        setOtpStatus(res.message);
        return false;
      }
      localStorage.setItem("token",res.token);
      console.log(res.token);
      setOtpStatus(res.message);
      setLogin(true);
      return true;
      
    }catch(err){
        console.error(err);
        setOtpStatus(err.message);
        return false;
    }
  }

  function logout(){
    localStorage.removeItem('token')
    setLogin(false)
    setProfile([])
  }
  return (
    <AuthContext.Provider value={{ reqOtpContext, verifyOtpContext,signupContext,login,logout, sendOTP, verify, otpStatus, isLoggedIn, profile, setProfile, setLogin }}>
      {children}
    </AuthContext.Provider>

  )

}

export const useAuth = () => useContext(AuthContext)

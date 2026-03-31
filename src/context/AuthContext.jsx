import { createContext, useState, useContext, useEffect } from 'react'


import * as authService from '../services/authservieces'


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setLogin] = useState(false)
  const [otpStatus, setOtpStatus] = useState('')
  const [profile, setProfile] = useState([])

  const [signupToken, setToken] = useState('');

  useEffect(()=>{
    const signToken = localStorage.getItem('signToken')
    console.log(signToken)
    if(signToken){
      setToken(signToken);
    }
  })

  async function reqOtpContext(formData) {

    try {
      setOtpStatus('')
      const res = await authService.reqOtp(formData)
     
      if(!res.success){
        console.log(res)
        setOtpStatus(res.message);
        return;
      }
      
   
        
    } catch (err) {
      console.error(err.message)
      setOtpStatus(err.message)
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

      setOtpStatus(res.message);

      
    }catch(err){
      console.error(err);
      setOtpStatus(err.message)
    }
    
  }

  return (
    <AuthContext.Provider value={{ reqOtpContext, verifyOtpContext,signupContext, otpStatus, isLoggedIn, profile, setProfile, setLogin }}>
      {children}
    </AuthContext.Provider>

  )

}

export const useAuth = () => useContext(AuthContext)

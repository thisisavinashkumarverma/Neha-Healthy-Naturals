const api = import.meta.env.VITE_API_URL;

export const reqOtp = async(formData)=>{

  try{
    const res = await fetch(`${api}/reqotp`,{
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data?.message);
    
    }

    return data;

  }catch(err){

    throw err;

  }
}

export const verifyotp = async(formData)=>{
  
  try{
    const res = await fetch(`${api}/verifyotp`,{
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data?.message);
    }

    return data;

  }catch(err){
    console.error(err.message);
    throw err;

  }

}

export const signup = async(formData, token)=>{

  try{
    const res = await fetch(`${api}/signup`,{
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if(!res.ok){
      throw new Error(data?.message);
    }

    return data;

  }catch(err){
    console.error(err.message);
    throw err;

  }
}
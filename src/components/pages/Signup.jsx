import React, { useEffect, useState } from 'react'
import { inputITEMS } from '../../data/input'
import InputComponent from '../InputComponent'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import '../../CSS/register.css'



function Signup() {

  let [user, setuser] = useState({ fname: "", number: "", email: "", password: "", confirmpwd: "", dob: "" })

  let [errors, setErrors] = useState({});

  let navigateTolog = useNavigate()

  let updateUser = ({ target: { name, value } }) => {
    setuser({ ...user, [name]: value })
    setErrors({...errors, [name]: "" });

  }
  
  let [userD, setuserD] = useState([])


  let getdata = async()=>{
    
    try{

      let {data} = await axios.get('http://localhost:3000/users')
      setuserD(data)

    }
    catch(err)
    {
      console.log(err)
    }    
    
  }

  useEffect (()=>{
    getdata()
  },[])

  

  


  let validateForm = () => {
    let valid = true;
    let newErrors = {};

    let uemail = userD.some(users=>users.email===user.email)

    if(uemail)
      {
        newErrors.email = "email already existed"
        valid = false; 
      }

      let umobile = userD.some(users=>users.number===user.number)

    if(umobile)
      {
        newErrors.number = "mobile number already existed"
        valid = false; 
      }



    if (!user.fname.trim()) {
      newErrors.fname = "First name is required";
      valid = false;
    }

    if (!/^[ a-zA-Z\s]*$/.test(user.fname)){
      newErrors.fname = "First name cannot contain special characters or numbers";
      valid = false;
    }

    if (user.number.length !== 10){
      newErrors.number = "Enter a valid 10-digit phone number";
      valid = false;
    }else if(!/[0-9]+.{9}/.test(user.number)){
      newErrors.number = "Enter phone number only";
    }

    if (!user.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    if (user.password !== user.confirmpwd) {
      newErrors.confirmpwd = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  let adduser = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('http://localhost:3000/users', user);
        navigateTolog('/login');
      } catch (err) {
        console.log(err);
      }
    }
  }
  
  
 
  return (
    <form onSubmit={adduser}>
      {inputITEMS.map((input) => (
        <div key={input.id}>
          <InputComponent {...input} onchange={updateUser} />
          {errors[input.name] && <span className="error">{errors[input.name]}</span>}
        </div>
      ))}
      <button onClick={validateForm}>Register</button>
     
    </form>
  )
}

export default Signup
import React, { useState } from "react";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate= useNavigate()

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setBtnLoading(true)
    try {
        const {data} = await axios.post(`${server}/api/user/forgot`,{email})

        toast.success(data.message)
        setBtnLoading(false)
        navigate('/login')
    } catch (error) {
        toast.error(error.response.data.message)
        setBtnLoading(false)
    }
  }
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit} action="">
          <label htmlFor="text">Enter Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button disabled={btnLoading} className="common-btn">
            {btnLoading? "Please wait...":"Forgot Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;

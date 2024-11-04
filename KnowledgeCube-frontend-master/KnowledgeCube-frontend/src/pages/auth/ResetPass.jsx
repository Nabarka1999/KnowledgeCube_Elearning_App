import React, { useState } from "react";
import "./auth.css";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPass = () => {
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/user/reset?token=${params.token}`,
        { password }
      );

      toast.success(data.message);
      setBtnLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit} action="">
          <label htmlFor="text">Enter Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={btnLoading} className="common-btn">
            {btnLoading ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPass;

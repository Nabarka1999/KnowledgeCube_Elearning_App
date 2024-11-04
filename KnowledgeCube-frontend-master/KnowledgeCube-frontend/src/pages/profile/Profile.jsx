import React from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";
import "./profile.css";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const { setIsAuth, setUser } = UserData();

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out successfully!");
    navigate("/login");
  };
  return (
    <>
      {user && (
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-content">
            <p>
              <strong>Name - {user.name}</strong>
            </p>
            <p>
              <strong>Email - {user.email}</strong>
            </p>

            {user.role === "user" && (
              <button
                onClick={() => navigate(`/${user._id}/dashboard`)}
                className="common-btn"
              >
                <MdSpaceDashboard />
                Dashboard
              </button>
            )}

            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn"
              >
                <MdSpaceDashboard />
                Admin Dashboard
              </button>
            )}
            <button onClick={logoutHandler} className="logout-btn">
              <IoLogOutOutline />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;

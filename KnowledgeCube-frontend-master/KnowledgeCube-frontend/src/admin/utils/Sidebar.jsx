import React from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { HiMiniUsers } from "react-icons/hi2";
import { IoLogOutSharp } from "react-icons/io5";
import { UserData } from "../../context/UserContext";

const Sidebar = () => {
  const { user } = UserData();
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon">
              <FaHome />
            </div>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to={"/admin/course"}>
            <div className="icon">
              <ImBooks />
            </div>
            <span>Course</span>
          </Link>
        </li>
        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/users"}>
              <div className="icon">
                <HiMiniUsers />
              </div>
              <span>Users</span>
            </Link>
          </li>
        )}
        <li>
          <Link to={"/account"}>
            <div className="icon">
              <IoLogOutSharp />
            </div>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

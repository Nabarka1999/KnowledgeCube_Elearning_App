import React, { useEffect, useState } from "react";
import "./userWatch.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../utils/Layout";
import toast from "react-hot-toast";

const UserWatch = ({ user }) => {
  const navigate = useNavigate();
  if (user && user.mainrole !== "superadmin") {
    return navigate("/");
  }

  const [users, setUsers] = useState([]);
  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async(id) =>{
    if(confirm("Are you sure you want change the role of this user?")){
        try {
            const {data} = await axios.put(`${server}/api/user/${id}`,{},{
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            toast.success(data.message);
            fetchUsers();
            
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
  }

  console.log(users);
  return (
    <Layout>
      {/* <div className="users">
            <h1>All Users</h1>
            <table border={"black"}></table>
            <thead>
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>Email</td>
                    <td>Role</td>
                    <td>Update Role</td>
                </tr>
            </thead>

            {users && users.map((e,i)=>{
                return (<tbody>
                    <tr>
                        <td>{i+1}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td>{e.role}</td>
                        <td>
                            <button className='common-btn'>Update Role</button>
                        </td>
                    </tr>
                </tbody>)
            })}
        </div> */}

      <div className="users">
        <h1>All Users</h1>
        <table border="1">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Update Role</td>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((e, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>{e.role}</td>
                    <td>
                      <button onClick={()=>updateRole(e._id)} className="role-btn">Update Role</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UserWatch;

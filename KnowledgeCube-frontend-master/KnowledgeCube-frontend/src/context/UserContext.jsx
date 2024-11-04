import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'
import { server } from "../main";
import toast, {Toaster} from 'react-hot-toast'

const UserContext = createContext()

export const UserContextProvider = ({children})=> {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth]= useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);


    async function loginUser(email, password, navigate, fetchMyCourse ){
        setBtnLoading(true);
        try {
            const {data} =await axios.post(`${server}/api/user/login`,{email, password})

            toast.success(data.message);
            localStorage.setItem("token", data.token);

            setUser(data.user)
            setIsAuth(true)
            setBtnLoading(false)
            navigate('/');
            fetchMyCourse();
        } catch (error) {
            setBtnLoading(false)
            setIsAuth(false)
            toast.error(error.response.data.message);
        }
    }

    async function registerUser(name, email, password, navigate){
        setBtnLoading(true);
        try {
            const {data} =await axios.post(`${server}/api/user/register`,{name, email, password})

            toast.success(data.message);
            localStorage.setItem("actToken", data.actToken);
            setBtnLoading(false)
            navigate('/verify');
        } catch (error) {
            setBtnLoading(false)
            toast.error(error.response.data.message);
        }
    }

    async function fetchUser(){
        try {
            const {data} = await axios.get(`${server}/api/user/me`,{
                headers:{
                    token: localStorage.getItem("token"),
                },
            });

            setIsAuth(true)
            setUser(data.user)
            setLoading(false)
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    // for payment
    async function verifyUser(otp, navigate){
        setBtnLoading(true);
        const actToken = localStorage.getItem("actToken")
        try {
            const {data} =await axios.post(`${server}/api/user/verify`,{otp, actToken})

            toast.success(data.message);
            navigate("/login");
            setBtnLoading(false);
            toast.success("Now you can login!");
            localStorage.clear();
        } catch (error) {
            setBtnLoading(false)
            setIsAuth(false)
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        fetchUser()
    },[])
    return <UserContext.Provider value={{user, setUser, isAuth, setIsAuth, loginUser, btnLoading, loading, registerUser, verifyUser, fetchUser}}>
        {children}
        <Toaster/>
        </UserContext.Provider>
}

export const UserData =()=> useContext(UserContext);
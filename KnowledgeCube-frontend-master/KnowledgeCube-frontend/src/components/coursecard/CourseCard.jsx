import React from 'react'
import './courseCard.css';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../../context/UserContext';
import { server } from '../../main';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CourseData } from '../../context/CourseContext';

// const server = 'https://4af9-103-102-117-125.ngrok-free.app'

const CourseCard = ({course}) => {
  const navigate = useNavigate()
  const {user, isAuth} = UserData()
  const { fetchCourses } = CourseData()

  const deleteHandler = async(id)=>{
    if(confirm("Are you sure that you want to delete the course?")){
      try {
        const {data} = await axios.delete(`${server}/api/course/${id}`,
          {
            headers:{
              token : localStorage.getItem("token")
            }
          }
        );
  
        toast.success(data.message)
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  }
  
  return (
    <div className="course-card">
        <img src={`${server}/${course.thumbnail}`} alt="" className='course-thumbnail'/>
        <h3>{course.title}</h3>
        <p>Instructor - {course.author}</p>
        <p>Duration : {course.duration} Weeks</p>
        <p>Price: {course.price}</p>
        {
          isAuth ? (
            <>
            {user && user.role !== "admin"? 
            <>
            {
              user.subscription.includes(course._id)? 
              (<button onClick={()=>navigate(`/course/study/${course._id}`)} className='course-btn'>Continue your study</button>) :
              (<button onClick={()=>navigate(`/course/${course._id}`)} className='course-btn'>Let&apos;s begin!</button>)
            }
            </> : <button 
            onClick={()=>navigate(`/course/study/${course._id}`)} className='course-btn'>
              Continue your study
              </button>}
            </>
          
        ) : (<button onClick={()=>navigate('/login')} className='course-btn'>Let&apos;s begin!</button>)
        }

        {
          user && user.role === 'admin' && 
          <button className='course-delete' onClick={()=>deleteHandler(course._id)} >Delete Course</button>
        }
        
    </div>
  )
}

export default CourseCard

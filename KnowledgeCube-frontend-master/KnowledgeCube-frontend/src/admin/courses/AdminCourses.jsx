import React, { useState } from 'react'
import Layout from '../utils/Layout'
import { useNavigate } from 'react-router-dom';
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/coursecard/CourseCard';
import "./adminCourses.css";
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const AdminCourses = ({user}) => {
    const navigate = useNavigate();
  if (user && user.role !== "admin") {
    return navigate("/");
  }

  const [title, setTitle]= useState("")
  const [description, setDescription] =useState("")
  const [category, setCategory] =useState("")
  const [author, setAuthor] =useState("")
  const [duration, setDuration] =useState("")
  const [price, setPrice] =useState("")
  const [thumbnail, setThumbnail] =useState("")
  const [thumbnailPrev, setThumbnailPrev] =useState("")
  const [btnLoading, setBtnLoading] =useState(false)
  const {courses, fetchCourses} = CourseData()

  const imageHandler = (e)=>{
    const file =  e.target.files[0];
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onloadend = () =>{
      setThumbnailPrev(reader.result)
      setThumbnail(file)
    }
  }

  const submitHandler = async (e)=>{
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData()
     myForm.append("title",title)
     myForm.append("description",description)
     myForm.append("category",category)
     myForm.append("author",author)
     myForm.append("duration",duration)
     myForm.append("price",price)
     myForm.append("file",thumbnail)

     try {
      const {data} = await axios.post(`${server}/api/course/new`, myForm, {
        headers:{
          token: localStorage.getItem("token")
        }
      })

      toast.success(data.message)
      setBtnLoading(false)
      await fetchCourses()
      setTitle("")
      setDescription("")
      setCategory("")
      setAuthor("")
      setDuration("")
      setPrice("")
      setThumbnail("")

     } catch (error) {
      toast.error(error.response.data.message)
      setBtnLoading(false)
     }
  }

  return (
    <Layout>
      <div className="admin-courses">
        <div className="left">
            <h1>All Courses</h1>
            <div className="dashboard-content">
                {
                    courses && courses.length>0 ? courses.map((e)=>{
                        return <CourseCard key={e._id} course={e}/>
                    }) : <p>No Courses yet.</p>
                }
            </div>
        </div>
        <div className="right">
            <div className="add-course">
                <div className="course-form">
                    <h2>Add Course</h2>
                    <form action="" onSubmit={submitHandler}>
                        <label htmlFor="text">Course title</label>
                        <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} required/>

                        <label htmlFor="text">Description</label>
                        <input type="text" value={description} onChange={(e)=> setDescription(e.target.value)} required/>

                        <label htmlFor="text">Category</label>
                        <input type="text" value={category} onChange={(e)=> setCategory(e.target.value)} required/>

                        <label htmlFor="text">Author</label>
                        <input type="text" value={author} onChange={(e)=> setAuthor(e.target.value)} required/>

                        <label htmlFor="text">Duration in weeks</label>
                        <input type="number" value={duration} onChange={(e)=> setDuration(e.target.value)} required/>

                        <label htmlFor="text">Price</label>
                        <input type="number" value={price} onChange={(e)=> setPrice(e.target.value)} required/>

                        <input type="file" onChange={imageHandler} required/>

                        {
                            thumbnailPrev && <img src={thumbnailPrev} alt="" width={300}/>
                        }

                        <button type='submit' disabled={btnLoading} className='common-btn'>
                            {
                                btnLoading? "Please wait..." :"Add course"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminCourses

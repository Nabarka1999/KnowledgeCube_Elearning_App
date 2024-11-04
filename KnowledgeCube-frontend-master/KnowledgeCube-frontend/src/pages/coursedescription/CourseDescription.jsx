import React, { useEffect, useState } from "react";
import "./courseDesription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {fetchUser} = UserData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  //payment method demo (for testing): 
  // const checkoutHandler = async ()=>{
  //   try {
  //   //   const {data} = await axios.post(`${server}/api/verification/${params.id}`,{
  //   //     razorpay_order_id, razorpay_payment_id, razorpay_signature
  //   //   },
  //   // {
  //   //   headers: {
  //   //     token,
  //   //   }
  //   // })

  //   await fetchUser();
  //   await fetchCourses();
  //   await fetchMyCourse();
  //   toast.success("Payment Successful!");
  //   setLoading(false);
  //   navigate(`/payment-success/DemoID1234`)
  //   } catch (error) {
  //     toast.error("Error: ",error);
  //     setLoading(false)
  //   }
  // }

  //payment method starts here (Actual)
  const checkoutHandler = async ()=>{
    const token = localStorage.getItem("token")
    setLoading(true)

    const {data: {order},} = await axios.post(`${server}/api/course/checkout/${params.id}`,{},{
      headers:{
        token,
      }
    });

    const options = {
      key: "rzp_test_pSqdsrm2JkL5q5", // Enter the Key ID generated from the Dashboard
      amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "KnowlegeCube", //your business name
      description: "Test Transaction",
      // image: "https://example.com/your_logo",
      order_id: order.id, // Pass the `id` obtained in the response of Step 1
      handler: async function(response){
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        try {
          const {data} = await axios.post(`${server}/api/verification/${params.id}`,{
            razorpay_order_id, razorpay_payment_id, razorpay_signature
          },
        {
          headers: {
            token,
          }
        })

        await fetchUser();
        await fetchCourses();
        await fetchMyCourse();
        toast.success(data.message);
        setLoading(false);
        navigate(`/payment-success/${razorpay_payment_id}`)
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false)
        }
      },
      theme:{
        color: "#D91656"
      }
    };
    const razorpay = new window.Razorpay(options);

    razorpay.open();
  }

  return (
    // <>
    //   {course && (
    //     <div className="course-description">
    //       <div className="course-header">
    //         <img
    //           src={`${server}/${course.thumbnail}`}
    //           alt=""
    //           className="course-thumbnail"
    //         />
    //         <div className="course-info">
    //           <h2>{course.title}</h2>
    //           <p>Instructor: {course.author}</p>
    //           <p>Duration: {course.duration} weeks</p>
    //         </div>
    //       </div>
    //       <p>Start your journey at just ₹{course.price}/-</p>

    //       {user && user.subscription.includes(course._id) ? (
    //         <button
    //           onClick={() => navigate(`/course/study/${course._id}`)}
    //           className="common-btn"
    //         >
    //           Begin study
    //         </button>
    //       ) : (
    //         <button onClick={checkoutHandler} className="common-btn">Buy Now</button>
    //       )}
    //     </div>
    //   )}
    // </>
    <>
    {/* after payment */}
    {
      loading? <Loading/> : (
      <>
        {course && (
          <div className="course-description">
            <div className="course-header">
              <img
                src={`${server}/${course.thumbnail}`}
                alt=""
                className="course-thumbnail"
              />
              <div className="course-info">
                <h2>{course.title}</h2>
                <p>Instructor: {course.author}</p>
                <p>Duration: {course.duration} weeks</p>
              </div>
            </div>
            <p>{course.description}</p>
  
            <p>Start your journey at just ₹{course.price}/-</p>
  
            {user && user.subscription.includes(course._id) ? (
              <button
                onClick={() => navigate(`/course/study/${course._id}`)}
                className="common-btn"
              >
                Begin study
              </button>
            ) : 
             (
               <button onClick={checkoutHandler} className="common-btn">Buy Now</button>
             )}
            
          </div>
        )}
      </>)
    }
    </>
  );
};

export default CourseDescription;

{/* (<button // need to change after enable my web site, and get razorpay key and secret key
            //   onClick={() => navigate(`/course/study/${course._id}`)}
            //   className="common-btn"
            // >
            //   Begin study
            // </button>)} */}
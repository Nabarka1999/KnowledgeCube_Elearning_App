import React from 'react'
import './testimonials.css';

const Testimonials = () => {
    const testimonialsData = [
        {
          id: 1,
          name: "Rajesh Kutrapally",
          position: "Data Engineer",
          message:
            "The learning experience here has been incredible! The lessons are structured perfectly, and I love how interactive everything is.",
          image:
            "https://media.istockphoto.com/id/1473711199/photo/face-portrait-student-and-man-in-university-ready-for-back-to-school-learning-goals-or.jpg?s=612x612&w=0&k=20&c=Xrwp5ePvm6RjixgAjJo-OAw9oXkLt_HcmT3bdlLZUdw=",
        },
        {
          id: 2,
          name: "Alina Smith",
          position: "Student",
          message:
            "I'm impressed by how much I've grown since joining. The courses are comprehensive, and the instructors explain even the toughest topics with ease!",
          image:
            "https://i0.wp.com/hbculifestyle.com/wp-content/uploads/2014/02/First-Generation-College-Student-Tips-for-Success.jpg",
        },
        {
          id: 3,
          name: "Lex Luthor",
          position: "Software Developer",
          message:
            "The platform makes learning enjoyable! I appreciate the community, the quality of the courses, and how quickly I can apply what I've learned in real-life projects.",
          image:
            "https://media.istockphoto.com/id/1446934118/photo/happy-business-man-listening-to-a-discussion-in-an-office.jpg?b=1&s=612x612&w=0&k=20&c=6CGz0oF0bra0Yiyn0PR2Sy31cA3CidlbsZlYZJx1nxg=",
        },
        {
          id: 4,
          name: "Shaun Todd",
          position: "Student",
          message:
            "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
          image:
            "https://media.istockphoto.com/id/1335941248/photo/shot-of-a-handsome-young-man-standing-against-a-grey-background.webp?b=1&s=612x612&w=0&k=20&c=07SAQPb33q39bTswXx3DsQWU0Mwnuvs2GxigTlLo9Lg=",
        },
      ];
  return (
    <section className='testimonials'>
        <h2>What our learners say</h2>
        <div className="testimonials-cards">
            {
                testimonialsData.map((e)=>(
                    <div className='card' key={e.id}>
                        <div className='lerner-image'>
                            <img src={e.image} alt="" />
                        </div>
                        <div className="info">
                            <p className="name">{e.name}</p>
                            <p className="position">{e.position}</p>
                        </div>
                        <p className="message">{e.message}</p>
                    </div>
                ))
            }
        </div>
    </section>
  )
}

export default Testimonials

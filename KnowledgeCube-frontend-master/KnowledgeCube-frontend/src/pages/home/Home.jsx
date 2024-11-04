import React from 'react'
import {useNavigate} from 'react-router-dom'
import './home.css';
import Testimonials from '../../components/testimonials/Testimonials';

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to KnowledgeCube, your path to success!</h1>
          <p>Learn Today, Lead Tomorrow</p>
          <button onClick={()=>navigate('/courses')} className='common-btn'>Let&apos;s Get Started</button>
        </div>
      </div>
      <Testimonials/>
    </div>
  )
}

export default Home

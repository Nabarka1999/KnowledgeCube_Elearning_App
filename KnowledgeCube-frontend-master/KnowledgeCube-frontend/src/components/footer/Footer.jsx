import React from 'react'
import './footer.css'
import { SiGmail } from "react-icons/si";
import { IoMdContact } from "react-icons/io";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
            &copy; 2024 KnowledgeCube. All rights reserved. Empowering learners worldwide with quality education and industry-leading instructors. Your success is our mission. <br/> 
            </p>
            <div className="social-links">
                <a href=""><SiGmail /></a>
                <a href=""><IoMdContact /></a>
                <a href=""><FaInstagram /></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer

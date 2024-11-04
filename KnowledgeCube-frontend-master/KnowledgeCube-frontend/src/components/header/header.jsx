import React from 'react'
import './header.css';
import {Link} from "react-router-dom";

const Header = ( {isAuth} ) => {
  return (
    <header>
        <div className="logo"><Link to={'/'}>KnowledgeCube</Link></div>
        
        <div className="link">
          <Link to={'/'}>Home</Link>
          <Link to={'/Courses'}>Courses</Link>
          <Link to={'/about'}>About</Link>
          {isAuth ? ( <Link to={'/account'}>Profile</Link> ) : ( <Link to={'/login'}>Login/Register</Link> )}
        </div>
    </header>
  )
}

export default Header

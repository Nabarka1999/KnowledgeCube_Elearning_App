import React from 'react'
import Sidebar from './Sidebar'
import './style.css';

const Layout = ({children}) => {
  return (
    <div className='dashboard-admin'>
      <Sidebar/>
      <div className='content'>{children}</div>
    </div>
  )
}

export default Layout

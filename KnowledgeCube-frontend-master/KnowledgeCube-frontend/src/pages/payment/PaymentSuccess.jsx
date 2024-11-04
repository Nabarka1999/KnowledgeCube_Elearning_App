import React from 'react'
import './paymentSuccess.css';
import { Link, useParams } from 'react-router-dom';

const PaymentSuccess = ({user}) => {
    const params = useParams()
  return (
    <div className="payment-success-page">
        {user && 
        <div className='success-message'>
            <h2>Payment Successful</h2>
            <p>Your course subscription has been activated. <br /> Happy Learning!</p>
            <p>Reference no - {params.id}</p>
            <Link to={`/${user._id}/dashboard`} className='common-btn'>Your Dashboard</Link>
        </div>}
    </div>
  )
}

export default PaymentSuccess
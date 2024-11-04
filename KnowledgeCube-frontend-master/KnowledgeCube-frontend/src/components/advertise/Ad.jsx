import React from 'react'

const Ad = () => {
  return (
    <section className='advertise'>
        <h2>Our top courses</h2>
        <div className="advertise-cards">
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

export default Ad

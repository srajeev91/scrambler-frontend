import React from 'react'
import Adapter from './Adapter'

const Home = () => {
  return (
    <div className="home">
      { Adapter.isLoggedIn() ? <h3>Welcome to Scrambler!</h3> : <h3>Login or Sign Up</h3> }
    </div>
  )
}

export default Home;

import React from 'react'
import "../Styles/Home.css";
import home1 from "../assets/home1.svg"
import home2 from "../assets/home2.svg"
import home3 from "../assets/home3.svg"
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-banner">
      <div className="home-container">
          <h2>Manage What To Do</h2>
          <p>The best way to manage what you have to do, don't forget your plans</p>

          <Link to="/home" ><div className="home-button">
          <button type="button" >Get Started</button>
         </div></Link>

          </div>
          <div className="vect1"><img src={home1} alt="" /> </div>
          <div className="vect2"><img src={home2} alt="" /> </div>
          <div className="ellipses"><img src={home3} alt="" /> </div>
          </div>
  )
}

export default Home

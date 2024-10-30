import React from 'react'
import Calendar from '../Components/Calender'
import SearchBar from '../Components/SearchBar'
import Reminder from '../Components/Reminder'
import WeeklyProgress from '../Components/Progress'
import TaskList from '../Components/TaskList'
import Add from "../assets/add-button.svg"
import "../Styles/Main.css"
import TaskPopup from './TaskPopup'
import { useState } from 'react'

const Main = () => {

  const [isPopupOpen, setPopupOpen] = useState(false);

    const handleAddButtonClick = () => {
        setPopupOpen(true); // Open the popup
    };

    const closePopup = () => {
        setPopupOpen(false); // Close the popup
    };


  return (
    <div className='main-page'>
        <SearchBar/>
        <Calendar/>
        <Reminder/>
        <WeeklyProgress/>
        <TaskList/>
        <button className="main-add-button" onClick={handleAddButtonClick}> <img src={Add} alt="Add" className="main-add" /></button>
        <TaskPopup isOpen={isPopupOpen} onClose={closePopup} /> {/* Render the popup */}
    </div>
  )
}

export default Main
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/SearchBar.css';

const API_URL = import.meta.env.VITE_API_URL; 

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate(); // To navigate to ViewTask page

  // Handle input change
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch tasks based on search term
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/tasks?search=${searchTerm}`);
      const filteredTasks = response.data.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredTasks); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Navigate to ViewTask page for selected task
  const handleTaskClick = (id) => {
    navigate(`/view-task/${id}`);
  };

  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Search for a task"
        className="search-input"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSearch();
          }
        }}
      />
      <div className="searchbar-icon" onClick={handleSearch}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10.5" cy="10.5" r="7.5" stroke="#090E23" strokeWidth="1.5" />
          <line x1="16.5" y1="16.5" x2="21.5" y2="21.5" stroke="#090E23" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Display search results */}
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map(task => (
            <li 
              key={task._id} 
              onClick={() => handleTaskClick(task._id)} 
              className="search-result-item"
            >
              {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
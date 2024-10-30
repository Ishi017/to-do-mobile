import Main from './Pages/Main'
import AllTasks from './Pages/AllTasks';
import Home from "./Pages/Home.jsx"
import ViewTask from './Pages/ViewTask';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/home" element={<Main />} />
      <Route path="/all-tasks" element={<AllTasks />} />
      <Route path="/view-task/:id" element={<ViewTask />} />
    </Routes>
  </Router>
  )
}

export default App

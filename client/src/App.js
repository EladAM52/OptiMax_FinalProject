import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/login'; // Adjust the path based on your file structure
import HomePage from './components/homePage';
import UsersTable from './components/workersManagement';
import Layout from './components/layout';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/getusers" element={<Layout><UsersTable /></Layout>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

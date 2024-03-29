import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/login'; 
import HomePage from './components/homePage';
import UsersTable from './components/workersManagement';
import Layout from './components/layout';
import AddUserForm from './components/addUser';
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Layout><HomePage /></Layout>} />
          <Route path="/getusers" element={<Layout><UsersTable /></Layout>} />
          <Route path="/adduser" element={<Layout><AddUserForm /></Layout>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

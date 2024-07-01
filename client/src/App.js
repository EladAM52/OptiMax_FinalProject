import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Login from './components/login'; 
import HomePage from './components/homePage';
import UsersTable from './components/workersManagement';
import Layout from './components/layout';
import AddUserForm from './components/addUser';
import UserProflie from './components/Profile';
import EditProfile from "./components/editProfile";
import TaskLog from "./components/TaskLog";
import Documents from "./components/UploadDocuments";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<Layout><HomePage /></Layout>} />
          <Route path="/getusers" element={<Layout><UsersTable /></Layout>} />
          <Route path="/adduser" element={<Layout><AddUserForm /></Layout>} />
          <Route path="/UserProfile/:userId" element={<Layout><UserProflie /></Layout>} />
          <Route path="/EditProfile/:userId" element={<Layout><EditProfile /></Layout>} />
          <Route path="/TaskLog" element={<Layout><TaskLog /></Layout>} />
          <Route path="/Documents" element={<Layout><Documents /></Layout>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

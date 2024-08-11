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
import ShiftSchedule from "./components/ShiftSchedule";
import ShiftArrangement from "./components/ShiftArrangement";
import ShiftArrangementViewer from "./components/ShiftArrangementViewer";
import EmployeeShiftsViewer from "./components/EmployeeShiftsViewer";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//login" element={<Login />} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//homepage" element={<Layout><HomePage /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//getusers" element={<Layout><UsersTable /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//adduser" element={<Layout><AddUserForm /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//UserProfile/:userId" element={<Layout><UserProflie /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//EditProfile/:userId" element={<Layout><EditProfile /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//TaskLog" element={<Layout><TaskLog /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//Documents" element={<Layout><Documents /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//ShiftSchedule" element={<Layout><ShiftSchedule /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//ShiftArrangement" element={<Layout><ShiftArrangement /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//ShiftArrangementViewer" element={<Layout><ShiftArrangementViewer /></Layout>} />
          <Route path="https://lemon-rock-074234210.5.azurestaticapps.net//EmployeeShiftsViewer" element={<Layout><EmployeeShiftsViewer /></Layout>} />
          <Route path="/" element={<Navigate replace to="https://lemon-rock-074234210.5.azurestaticapps.net//login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

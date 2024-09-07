/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebare from './common/Sidebare'; // Ensure component name is correct
import Dashboard from './components/Dashboard';
import TeacherForm from './pages/TeacherForm';
import TeacherFormAdmin from './pages/TeacherFormAdmin';
import TeacherList from './pages/TeacherList';
import UpdateTeacherForm from './pages/UpdateTeacherForm';
import NaveBare from './common/Navebare'; // Corrected component name
import DashProfile from './Dashboard/DashProfile'; 
import PrivateRoute from './context/PrivateRoute';
import RoleBasedRoute from './context/RoleBasedRoute';
import SigIn from './Dashboard/SigIn'; 
import Singup from './Dashboard/Singup'; 
import ListUser from './Dashboard/ListUser'; 
import Home from './Home/Home'; 
import NotFound from './context/NotFound';
import Report from './reports/Report';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col   dark:bg-gray-900 dark:text-white ">
        <NaveBare /> {/* Ensure the NaveBare is fixed at the top */}
        <div className="flex flex-1">
          <Sidebare  /> {/* Sidebare is fixed to the left */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/signin" element={<SigIn />} />
              {/* <Route path="/" element={<>} /> */}

              {/* Protected routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><DashProfile /></PrivateRoute>} />
              <Route path="/teacher/form" element={<RoleBasedRoute requiredRole="Admin"><TeacherForm /></RoleBasedRoute>} />
              <Route path="/teacher/FormAdmin" element={<RoleBasedRoute requiredRole="Admin"><TeacherFormAdmin/></RoleBasedRoute>} />
              <Route path="/teachersList" element={<RoleBasedRoute requiredRole="Admin"><TeacherList /></RoleBasedRoute>} />
              <Route path="/signup" element={<RoleBasedRoute requiredRole="Admin"><Singup /></RoleBasedRoute>} />
              <Route path="/update-teacher/:id" element={<RoleBasedRoute requiredRole="Admin"><UpdateTeacherForm /></RoleBasedRoute>} />
              <Route path="/listUsers" element={<RoleBasedRoute requiredRole="Admin"><ListUser /></RoleBasedRoute>} />
              <Route path="/report" element={<RoleBasedRoute requiredRole="Admin"><Report  /></RoleBasedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
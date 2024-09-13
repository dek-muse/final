import { Navigate } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebare from './common/Sidebare'; // Ensure component name is correct
import Dashboard from './components/Dashboard';
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
import SittiForm from './zone/FromZone/SittiForm';
import DaawoForm from './zone/FromZone/DaawoForm';
import ErarForm from './zone/FromZone/ErarForm';
import FaafanForm from './zone/FromZone/FaafanForm';
import JararForm from './zone/FromZone/JararForm';
import LiibaanForm from './zone/FromZone/LiibaanForm';
import NogobForm from './zone/FromZone/NogobForm';
import QoraxayForm from './zone/FromZone/QoraxayForm';
import ShabelleForm from './zone/FromZone/ShabelleForm';
import AfdheerForm from './zone/FromZone/AfdheerForm';
import JararReport from "./zone/reportZone/JararReport"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col ">
        <NaveBare /> {/* Ensure the NaveBare is fixed at the top */}
        <div className="flex flex-1">
          <Sidebare /> {/* Sidebare is fixed to the left */}
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/signin" element={<SigIn />} />

              {/* Protected routes */}
              <Route path="/profile" element={<PrivateRoute><DashProfile /></PrivateRoute>} />

              {/* Region-specific teacher forms */}
              <Route path="/teacher/form/sitti" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Sitti"><SittiForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/daawo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Daawo"><DaawoForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/erar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Erar"><ErarForm /></RoleBasedRoute>} />
              <Route path="/teacher/form" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Faafan"><FaafanForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/jarar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Jarar"><JararForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/liibaan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Liibaan"><LiibaanForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/nogob" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Nogob"><NogobForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/qoraxay" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Qoraxay"><QoraxayForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/shabelle" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Shabelle"><ShabelleForm /></RoleBasedRoute>} />
              <Route path="/teacher/form/afdheer" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Afdheer"><AfdheerForm /></RoleBasedRoute>} />


              {/* Region-specific teacher Report */}
              <Route path="/teacher/report/Afdheer" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Afdheer"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Daawo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Daawo"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Doolo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Doolo"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Erar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Erar"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Faafan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Faafan"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Jarar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Jarar"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Liibaan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Liibaan"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Nogob" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Nogob"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Qoraxay" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Qoraxay"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Shabelle" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Shabelle"><JararReport /></RoleBasedRoute>} />
              <Route path="/teacher/report/Sitti" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Sitti"><JararReport /></RoleBasedRoute>} />


              {/* SuperAdmin general   */}
              <Route path="/dashboard" element={<RoleBasedRoute requiredRole="SuperAdmin"><Dashboard /></RoleBasedRoute>} />
              <Route path="/teacher/formAdmin" element={<RoleBasedRoute requiredRole="SuperAdmin"><TeacherFormAdmin /></RoleBasedRoute>} />
              <Route path="/teachersList" element={<RoleBasedRoute requiredRole="SuperAdmin"><TeacherList /></RoleBasedRoute>} />
              <Route path="/signup" element={<RoleBasedRoute requiredRole="SuperAdmin"><Singup /></RoleBasedRoute>} />
              <Route path="/update-teacher/:id" element={<RoleBasedRoute requiredRole="SuperAdmin"><UpdateTeacherForm /></RoleBasedRoute>} />
              <Route path="/listUsers" element={<RoleBasedRoute requiredRole="SuperAdmin"><ListUser /></RoleBasedRoute>} />
              <Route path="/report" element={<RoleBasedRoute requiredRole="SuperAdmin"><Report /></RoleBasedRoute>} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;

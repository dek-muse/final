/* eslint-disable no-unused-vars */
import { Navigate } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebare from './common/Sidebare.jsx'; // Ensure component name is correct
import Dashboard from './components/Dashboard';
import TeacherForm from './pages/TeacherForm.jsx';
import TeacherList from './pages/TeacherList';
import TeachersInfo from './pages/TeachersInfo';
import TeacherDetails from './pages/TeacherDetails';
import UpdateTeacherForm from './pages/UpdateTeacherForm';
import NaveBare from './common/Navebare'; // Corrected component name
import DashProfile from './Dashboard/DashProfile';
import PrivateRoute from './context/PrivateRoute';
import RoleBasedRoute from './context/RoleBasedRoute';
import Connect from './components/Connect.jsx';
import About from './components/About.jsx';
// import SigIn from './Dashboard/SigIn';
import SingIn from './Dashboard/SigIn';
import Singup from './Dashboard/Singup';
import ListUser from './Dashboard/ListUser';
import Home from './Home/Home';
import NotFound from './context/NotFound';
import Report from './reports/Report';
// imports from pages
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
// imports  reports pages
import AfdheerReport from "./zone/reportZone/AfdheerReport"
import DaawoReport from "./zone/reportZone/DaawoReport"
import DooloReport from "./zone/reportZone/DooloReport"
import ErarReport from "./zone/reportZone/ErarReport"
import FaafanReport from "./zone/reportZone/FaafanReport"
import JararReport from "./zone/reportZone/JararReport"
import LiibaanReport from "./zone/reportZone/LiibaanReport"
import NogobReport from "./zone/reportZone/NogobReport"
import ShabelleReport from "./zone/reportZone/ShabelleReport"
import SittiReport from "./zone/reportZone//SittiReport"
import QoraxayReport from "./zone/reportZone/QoraxayReport"
// import Test from './pages/Test'
// import TestList from './pages/TestList'
import TeacherDetailsCard from './pages/TeacherDetailsCard';
import NoSidebarLayout from './layouts/NoSidebarLayout';
import SidebarLayout from './layouts/SidebarLayout';


const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen app">
        <NaveBare /> {/* Ensure the NaveBare is fixed at the top */}
        <div className="">
        {/* <Sidebare /> */}
        <main className="flex-1 p-6 overflow-auto">
            <Routes>
            <Route path="/" element={<NoSidebarLayout><Home /></NoSidebarLayout>} />
            <Route path="/*" element={<NotFound />} />
              <Route path="/signin" element={<SingIn />} />
              <Route path="/connect" element={<Connect  />} />
              <Route path="/about" element={<About  />} />

              {/* Protected routes */}
              <Route path="/profile" element={<PrivateRoute><DashProfile/></PrivateRoute>} />

              {/* Region-specific teacher forms */}
              {/* Wrap all region-specific teacher form routes with SidebarLayout */}
         

          <Route path="/teacher/form/sitti" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Sitti"><SidebarLayout><SittiForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/daawo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Daawo"><SidebarLayout><DaawoForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/erar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Erar"><SidebarLayout><ErarForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/fafaan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Faafan"><SidebarLayout><FaafanForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/jarar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Jarar"><SidebarLayout><JararForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/liibaan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Liibaan"><SidebarLayout><LiibaanForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/nogob" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Nogob"><SidebarLayout><NogobForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/qoraxay" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Qoraxay"><SidebarLayout><QoraxayForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/shabelle" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Shabelle"><SidebarLayout><ShabelleForm /></SidebarLayout></RoleBasedRoute>} />
          <Route path="/teacher/form/afdheer" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Afdheer"><SidebarLayout><AfdheerForm /></SidebarLayout></RoleBasedRoute>} />

        

              {/* Region-specific teacher reports */}
              <Route path="/teacher/report/afdheer" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Afdheer"><SidebarLayout><AfdheerReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/daawo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Daawo"><SidebarLayout><DaawoReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/doolo" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Doolo"><SidebarLayout><DooloReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/erar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Erar"><SidebarLayout><ErarReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/faafan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Faafan"><SidebarLayout><FaafanReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/jarar" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Jarar"><JararReport /><SidebarLayout></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/liibaan" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Liibaan"><SidebarLayout><LiibaanReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/nogob" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Nogob"><SidebarLayout><NogobReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/qoraxay" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Qoraxay"><SidebarLayout><QoraxayReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/shabelle" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Shabelle"><SidebarLayout><ShabelleReport /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/report/sitti" element={<RoleBasedRoute requiredRole="Admin" requiredRegion="Sitti"><SidebarLayout><SittiReport /> </SidebarLayout></RoleBasedRoute>} />

              {/* SuperAdmin general */}
              <Route path="/dashboard" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><Dashboard /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teachersList" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><TeacherList /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/signup" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><Singup /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/update-teacher/:id" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><UpdateTeacherForm /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/details/:id" element={<RoleBasedRoute requiredRole="SuperAdmin"><TeacherDetailsCard /><SidebarLayout></SidebarLayout></RoleBasedRoute>} />
              <Route path="/listUsers" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><ListUser /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/report" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><Report /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teachersInfo" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><TeachersInfo /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teachers/:id" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><TeacherDetails   /></SidebarLayout></RoleBasedRoute>} />
              <Route path="/teacher/form" element={<RoleBasedRoute requiredRole="SuperAdmin"><SidebarLayout><TeacherForm /></SidebarLayout></RoleBasedRoute>} />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
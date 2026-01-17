import React, { useState, useEffect } from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from 'axios';
import './App.css';
import Sidebar from './pages/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateMeeting from './pages/CreateMeeting';
import LoginPage from './pages/LoginPage';
import MeetingPage from './pages/MeetingPage';
import Database from './pages/Database';
import Template from './pages/Template';
import Template1 from "./components/template1";
import Reports from './pages/Reports';
import Calendar from './components/Calendar';
import Cmeeting from './components/template1';
import JoinMeet from './pages/joinmeet';
import AdminChooser from './components/AdminChooser';
import EditPoint from './pages/EditPoints';
import MeetingReportView from './pages/MeetingReportView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  const value = {
    ripple: true,
    inputStyle: 'outlined',
    appendTo: 'self',
    pt: {
      button: {
        root: { className: 'p-button' }
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <PrimeReactProvider value={value}>
      <Router>
        <div className="App">
          {isAuthenticated ? (
            <>
              <Sidebar className="sidebar" onLogout={handleLogout} />
              <div className="main-content">
                <Routes>
                  <Route path='/reportview' element={<MeetingReportView />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/create-meeting" element={<CreateMeeting />} />
                  <Route path="/admin-access" element={<AdminChooser />} />
                  <Route path="/meeting" element={< JoinMeet />} />
                  <Route path="/meetingadmin" element={< MeetingPage />} />
                  <Route path="/database" element={<Database />} />
                  <Route path="/template" element={<Template />} />
                  <Route path="/template/edit/:templateId" element={<Template />} />
                  <Route path="/template1" element={<Template1 />} />
                  <Route path="/cmeeting" element={<Cmeeting />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/support" element={<div>Support</div>} />
                  <Route path="/logout" element={<div>Logout</div>} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  <Route path='/calendar' element={<Calendar />} />
                  <Route path='/editpoints' element={<EditPoint />} />
                  <Route path='/reports/:id' element={<MeetingReportView />} />
                </Routes>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;

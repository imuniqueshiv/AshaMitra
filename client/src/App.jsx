import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { AppContent } from './context/AppContext';

import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Screening from "./pages/Screening";
import RoleSelection from "./pages/RoleSelection";  // ✅ NEW PAGE
import Dashboard from './pages/Dashboard';
import ReportDetails from './pages/ReportDetails';
import HospitalFinder from './pages/HospitalFinder';
import Profile from './pages/Profile';
import OfficerDashboard from './pages/OfficerDashboard';

const App = () => {
  const { backendUrl } = useContext(AppContent);

  // -------------------------------------------------------------
  // AUTO-SYNC LISTENER: Runs when internet comes back online
  // -------------------------------------------------------------
  useEffect(() => {
    const syncOfflineData = async () => {
      // Grab the queue from local storage
      const queue = JSON.parse(localStorage.getItem("offlineReportsQueue")) || [];
      
      if (queue.length > 0) {
        toast.info(`Syncing ${queue.length} offline reports to database...`, { autoClose: 3000 });
        
        let successCount = 0;
        let newQueue = [...queue];

        // Loop through the queue and send each report
        for (let i = 0; i < queue.length; i++) {
          try {
            await axios.post(`${backendUrl}/api/report/save`, queue[i], {
              withCredentials: true
            });
            successCount++;
            // Remove the successfully sent item from our temporary queue tracker
            newQueue = newQueue.filter(item => item !== queue[i]);
          } catch (error) {
            console.error("Failed to sync a report:", error);
            // Stop syncing if the server is rejecting/down to prevent infinite loops
            break; 
          }
        }
        
        // Update LocalStorage: If all sent, this empties it. If some failed, it keeps the failed ones.
        localStorage.setItem("offlineReportsQueue", JSON.stringify(newQueue));

        if (successCount > 0) {
          toast.success(`${successCount} offline records synced successfully!`);
        }
      }
    };

    // 1. Listen for the exact moment the browser detects the internet is back
    window.addEventListener('online', syncOfflineData);

    // 2. Just in case they start the app while already online, check the queue immediately
    if (navigator.onLine) {
      syncOfflineData();
    }

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, [backendUrl]);

  return (
    <div>
      <ToastContainer />

      <Routes>
        {/* HOME */}
        <Route path='/' element={<Home />} />

        {/* LOGIN + AUTH */}
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* NEW ROLE SELECTION PAGE */}
        <Route path='/select-role' element={<RoleSelection />} />

        {/* SCREENING PAGE */}
        <Route path='/screening' element={<Screening />} />

        {/* Dashboard Page */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/report-details/:id' element={<ReportDetails />} />
        {/* Report Details Page */}
        <Route path='/report-details' element={<ReportDetails />} />

        {/* HospitalFinder Page */}
        <Route path='/hospital-finder' element={<HospitalFinder />} />
        
        <Route path="/officer-dashboard" element={<OfficerDashboard />} />
        
        {/* Profile Page */}
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
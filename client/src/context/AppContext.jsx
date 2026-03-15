import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  // ✅ UPDATED: Changed localhost to your specific IP address
  // This allows your phone to talk to the laptop.
  // const backendUrl = "http://10.83.76.145:4000";
  // ✅ NEW (Localhost - Works on any WiFi for the laptop)
  const backendUrl = "http://localhost:4000";
  // const backendUrl = "http://10.165.81.145:4000"; // phone
  // const backendUrl = "http://10.164.5.145:4000";
  // const backendUrl = "http://172.21.154.145:4000";
  // ✅ NEW (Hotspot IP)
  // const backendUrl = "http://172.20.10.2:4000";

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Mode
  const [userMode, setUserMode] = useState(
    localStorage.getItem("userMode") || null
  );

  const updateUserMode = (mode) => {
    setUserMode(mode);
    localStorage.setItem("userMode", mode);
  };

  // History
  const [userHistory, setUserHistory] = useState([]);

  // Fetch user history
  const fetchUserHistory = async () => {
    // OFFLINE CHECK
    if (!navigator.onLine) {
      const cachedHistory = localStorage.getItem("userHistory");
      if (cachedHistory) setUserHistory(JSON.parse(cachedHistory));
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/report/history`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserHistory(data.reports);
        localStorage.setItem("userHistory", JSON.stringify(data.reports)); // Cache for offline
      }
    } catch (error) {
      if (error.message === "Network Error" || !navigator.onLine) {
        const cachedHistory = localStorage.getItem("userHistory");
        if (cachedHistory) setUserHistory(JSON.parse(cachedHistory));
        return;
      }
      console.error(error);
      toast.error("Failed to fetch history");
    }
  };

  // AUTH CHECK
  const getAuthState = async () => {
    // OFFLINE CHECK
    if (!navigator.onLine) {
      const cachedAuth = localStorage.getItem("isLoggedin") === "true";
      if (cachedAuth) {
        setIsLoggedin(true);
        getUserData();
        fetchUserHistory();
      }
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedin(true);
        localStorage.setItem("isLoggedin", "true"); // Cache for offline
        getUserData();
        fetchUserHistory();
      } else {
        setIsLoggedin(false);
        localStorage.removeItem("isLoggedin");
      }
    } catch (error) {
      // Handle server unreachable / soft offline
      if (error.message === "Network Error" || !navigator.onLine) {
        const cachedAuth = localStorage.getItem("isLoggedin") === "true";
        if (cachedAuth) {
          setIsLoggedin(true);
          getUserData();
          fetchUserHistory();
          return;
        }
      }

      if (!isLoggingOut) {
        console.log("Auth state failed:", error);
      }
      setIsLoggedin(false);
      localStorage.removeItem("isLoggedin");
    }
  };

  // USER DATA
  const getUserData = async () => {
    // OFFLINE CHECK
    if (!navigator.onLine) {
      const cachedUser = localStorage.getItem("userData");
      if (cachedUser) setUserData(JSON.parse(cachedUser));
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
        localStorage.setItem("userData", JSON.stringify(data.userData)); // Cache for offline
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      if (error.message === "Network Error" || !navigator.onLine) {
        const cachedUser = localStorage.getItem("userData");
        if (cachedUser) setUserData(JSON.parse(cachedUser));
        return;
      }
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    setIsLoggingOut,

    userMode,
    setUserMode: updateUserMode,

    userHistory,
    // fetchUserHistory,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
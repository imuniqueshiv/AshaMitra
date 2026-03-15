import axios from "axios";

export const saveReportData = async (reportData, backendUrl) => {
  if (navigator.onLine) {
    // DEVICE IS ONLINE -> Send straight to backend
    try {
      const { data } = await axios.post(`${backendUrl}/api/report/save`, reportData, {
        withCredentials: true,
      });
      return { success: true, message: "Saved to Cloud Database" };
    } catch (error) {
      console.error("Online save failed:", error);
      // Fallback to offline save if the server is down despite having Wi-Fi
      return saveToOfflineQueue(reportData);
    }
  } else {
    // DEVICE IS OFFLINE -> Save to LocalStorage Queue
    return saveToOfflineQueue(reportData);
  }
};

const saveToOfflineQueue = (reportData) => {
  try {
    // 1. Get existing queue (or create empty array)
    const existingQueue = JSON.parse(localStorage.getItem("offlineReportsQueue")) || [];
    
    // 2. Add a timestamp so we know when it was recorded
    reportData.offlineSavedAt = new Date().toISOString();
    
    // 3. Push new report and save back to local storage
    existingQueue.push(reportData);
    localStorage.setItem("offlineReportsQueue", JSON.stringify(existingQueue));
    
    return { success: true, message: "Saved locally. Will auto-sync when online." };
  } catch (error) {
    console.error("Failed to save offline:", error);
    return { success: false, message: "Failed to save offline" };
  }
};
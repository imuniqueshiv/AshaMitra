import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Activity, 
  MapPin, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Stethoscope,
  Download,
  Filter,
  Clock,
  Wifi,
  BarChart3,
  FileText
} from "lucide-react";

const OfficerDashboard = () => {
  const navigate = useNavigate();

  // --- MOCK DATA FOR HACKATHON DEMO ---
  const kpiData = [
    { title: "Total Screenings", value: "842", subtitle: "+124 this week", icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "High-Risk Alerts", value: "31", subtitle: "8 require immediate action", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
    { title: "Pending Referrals", value: "14", subtitle: "Awaiting CHC admission", icon: FileText, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { title: "Active ASHA Nodes", value: "45", subtitle: "Currently syncing data", icon: Wifi, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  ];

  const regionalHotspots = [
    { area: "Gandhinagar PHC", riskCount: 12, trend: "+3", severity: "high", percentage: 85 },
    { area: "Umaria CHC", riskCount: 8, trend: "+1", severity: "medium", percentage: 60 },
    { area: "Berasia Village", riskCount: 7, trend: "+4", severity: "medium", percentage: 55 },
    { area: "Kolar Block", riskCount: 4, trend: "-2", severity: "low", percentage: 25 },
    { area: "Phanda Village", riskCount: 2, trend: "0", severity: "low", percentage: 15 },
  ];

  const urgentAlerts = [
    { id: "PT-9021", date: "Today, 09:14 AM", name: "Ravi K.", risk: 92, type: "Suspected Pneumonia", asha: "Priya S.", status: "Pending Action" },
    { id: "PT-9044", date: "Today, 08:30 AM", name: "Suresh M.", risk: 88, type: "Suspected TB", asha: "Meena R.", status: "Ambulance Dispatched" },
    { id: "PT-9051", date: "Yesterday, 11:45 PM", name: "Anita D.", risk: 85, type: "Severe Hypoxia", asha: "Priya S.", status: "Pending Action" },
    { id: "PT-9012", date: "Yesterday, 04:20 PM", name: "Kishan L.", risk: 78, type: "Chronic Cough (>3wks)", asha: "Sunita W.", status: "Under Observation" },
  ];

  // Fake chart data for the CSS bar chart
  const weeklyTrend = [45, 52, 38, 65, 85, 72, 90]; 

  return (
    <div
      className="flex flex-col min-h-screen text-white font-sans"
      style={{ background: "linear-gradient(180deg, #0a0224, #36066d)" }}
    >
      <Navbar />

      {/* Page Header */}
      <div className="w-full mt-28 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto">
        <div className="text-left mb-6 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500/20 p-2 rounded-xl border border-purple-400/30">
              <Stethoscope className="w-6 h-6 text-purple-300" />
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              District Medical Officer Portal
            </h1>
          </div>
          <p className="text-white/60 text-base md:text-lg max-w-2xl">
            Live Health Insights & Edge Node Monitoring Dashboard
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            System Online (Synced)
          </div>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 my-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 lg:px-12 pb-12 max-w-7xl mx-auto w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        {/* SECTION 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, index) => (
            <div key={index} className="bg-[#150a3a]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all rounded-2xl p-6 flex flex-col shadow-2xl relative overflow-hidden group">
              {/* Subtle background glow effect */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${kpi.bg}`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl border ${kpi.bg} ${kpi.border}`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-1">{kpi.value}</h3>
                <p className="text-white/60 text-sm font-medium tracking-wide">{kpi.title}</p>
                <p className="text-white/40 text-xs mt-2">{kpi.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 2: Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (1/3 Width) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Visual Chart Placeholder (CSS Only) */}
            <div className="bg-[#150a3a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  7-Day Screening Trend
                </h2>
              </div>
              <div className="flex items-end justify-between h-32 gap-2 mt-4">
                {weeklyTrend.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-full bg-white/5 rounded-t-md relative flex justify-center h-full">
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-blue-400 rounded-t-md transition-all duration-1000"
                        style={{ height: `${val}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-white/40">Day {i+1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Hotspots */}
            <div className="bg-[#150a3a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Regional Hotspots
                </h2>
                <button className="text-xs text-blue-400 hover:text-blue-300">View Map</button>
              </div>
              
              <div className="flex flex-col gap-5">
                {regionalHotspots.map((area, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-white/90">{area.area}</span>
                      <span className="text-white/60 flex items-center gap-1">
                        {area.riskCount} Cases <TrendingUp className="w-3 h-3 text-red-400 ml-1" />
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${area.severity === 'high' ? 'bg-red-500' : area.severity === 'medium' ? 'bg-orange-400' : 'bg-blue-400'}`}
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Urgent Patient Alerts (Takes 2/3 width) */}
          <div className="lg:col-span-2 bg-[#150a3a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Live High-Risk Escalations
              </h2>
              <div className="flex gap-2">
                <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 transition-all">
                  <Filter className="w-3 h-3" /> Filter
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                    <th className="pb-3 px-4 font-medium">Patient Info</th>
                    <th className="pb-3 px-4 font-medium">AI Risk Score</th>
                    <th className="pb-3 px-4 font-medium">Suspected Issue</th>
                    <th className="pb-3 px-4 font-medium">Reporting Node</th>
                    <th className="pb-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {urgentAlerts.map((alert, index) => (
                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-sm">{alert.id} • {alert.name}</div>
                        <div className="text-xs text-white/40 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {alert.date}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${alert.risk > 85 ? 'text-red-400' : 'text-orange-400'}`}>
                            {alert.risk}%
                          </span>
                          <div className="w-16 bg-black/40 rounded-full h-1.5">
                            <div className={`h-full rounded-full ${alert.risk > 85 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${alert.risk}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-white/80">{alert.type}</td>
                      <td className="py-4 px-4 text-sm text-white/60 flex items-center gap-2 mt-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] border border-blue-500/30">
                          {alert.asha.charAt(0)}
                        </div>
                        {alert.asha}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center w-max gap-1.5 
                          ${alert.status === 'Pending Action' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                          : alert.status === 'Ambulance Dispatched' ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${alert.status === 'Pending Action' ? 'bg-orange-400' : alert.status === 'Ambulance Dispatched' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`}></span>
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* The Redirection Button */}
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-center">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="group flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition-colors font-semibold bg-blue-500/10 hover:bg-blue-500/20 px-6 py-2.5 rounded-full border border-blue-500/20"
              >
                Access Ground-Level Patient Database 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OfficerDashboard;
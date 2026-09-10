import React, { useState } from 'react';
import { PlatformProvider } from '../context/PlatformContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Dashboard from '../components/Dashboard';
import ScanFood from '../components/ScanFood';
import Hardware from '../components/Hardware'; // PROTECTED & UNTOUCHED BASELINE
import FoodDetails from '../components/FoodDetails';
import Nutrition from '../components/Nutrition';
import FoodCondition from '../components/FoodCondition';
import Inventory from '../components/Inventory';
import BatchManagement from '../components/BatchManagement';
import StorageColdChain from '../components/StorageColdChain';
import WasteReduction from '../components/WasteReduction';
import AiAssistant from '../components/AiAssistant';
import History from '../components/History';
import Alerts from '../components/Alerts';
import About from '../components/About';

function MainPlatform() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'Scan Food':
        return <ScanFood onNavigate={setActiveTab} />;
      case 'Hardware':
        // Protected, original, locked Hardware module rendered directly
        return <Hardware />;
      case 'Food Details':
        return <FoodDetails onNavigate={setActiveTab} />;
      case 'Nutrition':
        return <Nutrition onNavigate={setActiveTab} />;
      case 'Food Condition':
        return <FoodCondition onNavigate={setActiveTab} />;
      case 'Inventory':
        return <Inventory onNavigate={setActiveTab} />;
      case 'Batch Management':
        return <BatchManagement onNavigate={setActiveTab} />;
      case 'Cold Chain':
        return <StorageColdChain />;
      case 'Waste Reduction':
        return <WasteReduction />;
      case 'AI Assistant':
        return <AiAssistant />;
      case 'History':
        return <History onNavigate={setActiveTab} />;
      case 'Alerts':
        return <Alerts onNavigate={setActiveTab} />;
      case 'About':
        return <About />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-body flex">
      {/* Grouped Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Topbar with Mode Toggle and Alerts */}
      <Topbar onNavigate={setActiveTab} />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen bg-[#f8fafc]">
        {renderView()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <PlatformProvider>
      <MainPlatform />
    </PlatformProvider>
  );
}

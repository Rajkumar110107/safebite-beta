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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileNavOpen(false);
  };

  const renderView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard onNavigate={handleTabChange} />;
      case 'Scan Food':
        return <ScanFood onNavigate={handleTabChange} />;
      case 'Hardware':
        // Protected, original, locked Hardware module rendered directly
        return <Hardware />;
      case 'Food Details':
        return <FoodDetails onNavigate={handleTabChange} />;
      case 'Nutrition':
        return <Nutrition onNavigate={handleTabChange} />;
      case 'Food Condition':
        return <FoodCondition onNavigate={handleTabChange} />;
      case 'Inventory':
        return <Inventory onNavigate={handleTabChange} />;
      case 'Batch Management':
        return <BatchManagement onNavigate={handleTabChange} />;
      case 'Cold Chain':
        return <StorageColdChain />;
      case 'Waste Reduction':
        return <WasteReduction />;
      case 'AI Assistant':
        return <AiAssistant />;
      case 'History':
        return <History onNavigate={handleTabChange} />;
      case 'Alerts':
        return <Alerts onNavigate={handleTabChange} />;
      case 'About':
        return <About />;
      default:
        return <Dashboard onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 font-body flex flex-col transition-colors duration-200">
      {/* Grouped Sidebar with Mobile Drawer support */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
      
      {/* Topbar with Mode Toggle, Theme Toggle (Sun/Moon), and Hamburger for Mobile */}
      <Topbar
        onNavigate={handleTabChange}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        isMobileNavOpen={isMobileNavOpen}
      />

      {/* Main Content Area */}
      <main className="ml-0 lg:ml-64 flex-1 min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-200 overflow-x-hidden">
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

import React from "react";
import { FaFilter,FaDatabase,FaTruck, FaSignOutAlt} from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const menuItems = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: <FaDatabase/>, label: "Data" },
    { icon: <FaFilter />, label: "Filter" },
    { icon: <IoPeopleOutline />, label: "Customers" },
    {  label: "Driver" },
    { icon: <FaTruck />, label: "Vechile" },
    { icon: "💳", label: "Expences" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
  };

  return (
    <>
      <div
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-black text-white transition-all duration-300 fixed h-full z-50 flex flex-col`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2
            className={`text-xl font-bold ${
              isSidebarCollapsed ? "hidden" : "block"
            }`}
          >
            POS Dashboard
          </h2>
          {isSidebarCollapsed && <span className="text-xl font-bold">P</span>}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-800 transition-colors"
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="mt-5 flex-1">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all hover:bg-gray-800 ${
                item.active ? "bg-white text-black" : ""
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!isSidebarCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <div
            onClick={handleLogout}
            className="flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all hover:bg-red-800 hover:text-white"
          >
            <span className="text-lg"><FaSignOutAlt /></span>
            {!isSidebarCollapsed && (
              <span className="ml-3 font-medium">Logout</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
import React from "react";
import { FaFilter, FaDatabase, FaTruck, FaSignOutAlt } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaMoneyBill1 } from "react-icons/fa6";
import api from "../api";
import toast from "react-hot-toast";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: "📊", label: "Dashboard", to: "/" },
    { icon: <FaDatabase />, label: "Data", to: "/data" },
    { icon: <IoPeopleOutline />, label: "Customers", to: "/customers" },
    { icon: "🚗", label: "Driver", to: "/driver" },
    { icon: <FaTruck />, label: "Vehicle", to: "/vehicle" },
    { icon: "💳", label: "Expenses", to: "/expenses" },
    { icon: <FaMoneyBill1 />, label: "Payments", to: "/payment" },
  ];

  const handleLogout = async () => {
    try {
      const response = await api.post("/api/user/logout");
      if (response.data.success) {
        toast.success("Logged out successfully");
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white transition-all duration-300 z-50 ${
          isSidebarCollapsed
            ? "-translate-x-full lg:translate-x-0 lg:w-16"
            : "w-64"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2
            className={`font-bold transition-all duration-300 ${
              isSidebarCollapsed ? "hidden lg:hidden" : "text-lg"
            }`}
          >
            POS Dashboard
          </h2>
          {isSidebarCollapsed && (
            <span className="text-xl font-bold hidden lg:block">P</span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-800 transition-colors lg:block"
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.to}
              key={index}
              onClick={() =>
                window.innerWidth < 1024 && setIsSidebarCollapsed(true)
              }
              className={({ isActive }) =>
                `flex items-center px-3 py-3 mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } ${isSidebarCollapsed ? "justify-center lg:justify-center" : ""}`
              }
            >
              <span className="text-lg text-white flex-shrink-0">
                {item.icon}
              </span>
              <span
                className={`ml-3 transition-all duration-300 ${
                  isSidebarCollapsed ? "hidden lg:hidden" : "block"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200 ${
              isSidebarCollapsed ? "justify-center lg:justify-center" : ""
            }`}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            <span
              className={`ml-3 transition-all duration-300 ${
                isSidebarCollapsed ? "hidden lg:hidden" : "block"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

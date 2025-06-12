import React from "react";
import { FaFilter,FaDatabase,FaTruck, FaSignOutAlt} from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaMoneyBill1 } from "react-icons/fa6";
import api from "../api";
import toast from "react-hot-toast";
const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const navigate= useNavigate()
  const menuItems = [
    { icon: "📊", label: "Dashboard", to: "/" },
    { icon: <FaDatabase/>, label: "Data", to: "/data" },
    { icon: <FaFilter />, label: "Filter", to: "/filter" },
    { icon: <IoPeopleOutline />, label: "Customers", to: "/customers" },
    { icon: "🚗", label: "Driver", to: "/driver" },
    { icon: <FaTruck />, label: "Vehicle", to: "/vehicle" },
    { icon: "💳", label: "Expenses", to: "/expenses" },
    { icon: <FaMoneyBill1 />, label: "Payments", to: "/payment" },

  ];

  const handleLogout = async() => {
try {
  const responce= await api.post("/api/user/logout")
  console.log(responce.data);

  if(responce.data.success==true)
  {
    navigate("/signin")
    toast.success(responce.data.message,{
      duration:2000
    })
  }
  else
  {
    toast.error(responce.data.message,{
      duration:3000
    })
  }
  


} catch (error) {
  console.log("error in log out",error);
  
}
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
            <NavLink
              to={item.to}
              key={index}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 mx-2 mb-1 rounded-lg cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white hover:transform hover:scale-102"
                }`
              }
            >
              <span className={`text-lg text-white `}>
                {item.icon}
              </span>
              {!isSidebarCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
             
            </NavLink>
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
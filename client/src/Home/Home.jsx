import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default collapsed on mobile
  const navigate = useNavigate();

  const statsData = [
    {
      title: "Total Revenue",
      value: "$45,280",
      change: "+12.5%",
      isPositive: true,
      icon: "💰",
    },
    {
      title: "Total Expenses",
      value: "$18,420",
      change: "+8.2%",
      isPositive: false,
      icon: "💸",
    },
    {
      title: "Net Profit",
      value: "$26,860",
      change: "+15.3%",
      isPositive: true,
      icon: "📈",
    },
    {
      title: "Total Orders",
      value: "1,247",
      change: "+5.7%",
      isPositive: true,
      icon: "🛒",
    },
  ];

  const recentlyAddedData = [
    {
      id: 1,
      name: "Samsung Galaxy S24",
      type: "Product",
      price: "$899.99",
      time: "2 hours ago",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      type: "Product",
      price: "$1,199.99",
      time: "4 hours ago",
    },
    {
      id: 3,
      name: "MacBook Air M2",
      type: "Product",
      price: "$1,299.99",
      time: "6 hours ago",
    },
    {
      id: 4,
      name: "AirPods Pro",
      type: "Product",
      price: "$249.99",
      time: "1 day ago",
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      type: "Product",
      price: "$1,099.99",
      time: "1 day ago",
    },
  ];

  const recentExpenses = [
    {
      id: 1,
      description: "Office Rent",
      amount: "$2,500.00",
      category: "Fixed Costs",
      date: "Today",
      status: "Paid",
    },
    {
      id: 2,
      description: "Inventory Purchase",
      amount: "$8,750.00",
      category: "Inventory",
      date: "Yesterday",
      status: "Paid",
    },
    {
      id: 3,
      description: "Marketing Campaign",
      amount: "$1,200.00",
      category: "Marketing",
      date: "2 days ago",
      status: "Pending",
    },
    {
      id: 4,
      description: "Utility Bills",
      amount: "$450.00",
      category: "Utilities",
      date: "3 days ago",
      status: "Paid",
    },
  ];

  const [loading, SetLoading] = useState(false);

  const checkAccountLogin = async () => {
    SetLoading(true);
    try {
      const responce = await api.get("/api/user/authcheck");
      console.log(responce.data);
      if (responce.data.authenticated == true) {
        SetLoading(false);
      } else {
        navigate("/signin");
      }
      SetLoading(false);
    } catch (error) {
      console.log("error in checking user login", error);
      SetLoading(false);
      navigate("/signin");
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    checkAccountLogin();
  }, []);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />

          <div className="flex-1 lg:ml-16 transition-all duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <span className="text-xl">☰</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  Dashboard
                </h1>
                <div className="w-8"></div> {/* Spacer */}
              </div>
            </div>

            <div className="p-3 lg:p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
                {statsData.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-3 lg:p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1 truncate">
                          {stat.title}
                        </p>
                        <p className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                          {stat.value}
                        </p>
                        <p
                          className={`text-xs lg:text-sm font-medium mt-1 ${
                            stat.isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </p>
                      </div>
                      <div className="text-xl lg:text-3xl opacity-80 ml-2">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Recently Added Items */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Recently Added Items
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {recentlyAddedData
                      .slice(0, window.innerWidth < 768 ? 3 : 5)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{item.type}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {item.price}
                            </p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Recent Expenses
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {recentExpenses
                      .slice(0, window.innerWidth < 768 ? 3 : 4)
                      .map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {expense.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {expense.category} • {expense.date}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-red-600">
                              {expense.amount}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                expense.status === "Paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {expense.status}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
                    <button className="p-2 lg:p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                      New Sale
                    </button>
                    <button className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Add Product
                    </button>
                    <button className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Add Expense
                    </button>
                    <button className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        stat.isPositive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className="text-3xl opacity-80">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recently Added Items
              </h3>
              <div className="space-y-3">
                {recentlyAddedData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.price}
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Expenses
              </h3>
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {expense.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {expense.category} • {expense.date}
                      </p>
                    </div>
                    <div className="text-right">
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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
                  New Sale
                </button>
                <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Add Product
                </button>
                <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Add Expense
                </button>
                <button className="p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

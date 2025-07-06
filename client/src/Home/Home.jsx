import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Home = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); 
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAccountLogin = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/user/authcheck");
      
      if (response.data.authenticated === true) {
        await fetchDashboardData();
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.log("error in checking user login", error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/api/user/dashboard");
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  const statsData = dashboardData ? [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.currentMonth.revenue),
      isPositive: true,
      icon: "💰",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(dashboardData.currentMonth.expenses),
      isPositive: false,
      icon: "💸",
    },
    {
      title: "Net Profit",
      value: formatCurrency(dashboardData.currentMonth.profit),
      isPositive: dashboardData.currentMonth.profit >= 0,
      icon: "📈",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders.toString(),
      change: `+${dashboardData.currentMonth.orders} this month`,
      isPositive: true,
      icon: "🛒",
    },
  ] : [];

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

          {/* Main Content */}
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
                <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                <div className="w-8"></div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-6">
              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
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

              {/* Content Grid - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Latest Orders */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Latest Orders
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {dashboardData?.latestOrders
                      ?.slice(0, window.innerWidth < 768 ? 3 : 5)
                      .map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {order.containerNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order["CustomerDetails.customername"]} • {order.from} → {order.to}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(order.total)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    {(!dashboardData?.latestOrders || dashboardData.latestOrders.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-4">No orders found</p>
                    )}
                  </div>
                </div>

                {/* Recent Expenses */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Recent Expenses
                  </h3>
                  <div className="space-y-2 lg:space-y-3">
                    {dashboardData?.latestExpenses
                      ?.slice(0, window.innerWidth < 768 ? 3 : 4)
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
                              {expense.category} • {expense["vehicleDetails.plateNumber"]}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold text-red-600">
                              {formatCurrency(expense.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(expense.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    {(!dashboardData?.latestExpenses || dashboardData.latestExpenses.length === 0) && (
                      <p className="text-sm text-gray-500 text-center py-4">No expenses found</p>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
                    <button 
                      onClick={() => navigate('/data')}
                      className="p-2 lg:p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                      New Order
                    </button>
                    <button 
                      onClick={() => navigate('/customers')}
                      className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Add Customer
                    </button>
                    <button 
                      onClick={() => navigate('/expenses')}
                      className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Add Expense
                    </button>
                    <button 
                      onClick={() => navigate('/payment')}
                      className="p-2 lg:p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Manage Payments
                    </button>
                  </div>
                </div>
              </div>

              {/* Monthly Trends - Mobile Responsive */}
              {dashboardData?.monthlyTrends && (
                <div className="mt-6 lg:mt-8">
                  <div className="bg-white rounded-lg lg:rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">
                      Monthly Trends
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Revenue Trend */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Trend</h4>
                        <div className="space-y-2">
                          {dashboardData.monthlyTrends.revenue.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-1">
                              <span className="text-sm text-gray-600">
                                {new Date(item.year, item.month - 1).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                              <div className="text-sm font-semibold text-green-600">
                                {formatCurrency(item.revenue)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.orderCount} orders
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expense Trend */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Expense Trend</h4>
                        <div className="space-y-2">
                          {dashboardData.monthlyTrends.expenses.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-1">
                              <span className="text-sm text-gray-600">
                                {new Date(item.year, item.month - 1).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                              <div className="text-sm font-semibold text-red-600">
                                {formatCurrency(item.expenses)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;

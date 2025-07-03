import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Expence = () => {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [Vehicles, SetVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form for Add Expense
  const {
    register: registerExpense,
    handleSubmit: handleSubmitExpense,
    reset: resetExpense,
    formState: { errors: expenseErrors },
  } = useForm({
    defaultValues: {
      description: "",
      amount: "",
      category: "Fuel",
      vehicleId: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    },
  });

  // Form for Add Amount
  const {
    register: registerAmount,
    handleSubmit: handleSubmitAmount,
    reset: resetAmount,
    formState: { errors: amountErrors },
  } = useForm({
    defaultValues: {
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const [expencedetail, SetExpenceDetail] = useState(null);
  const handleExpencedetail = (order) => {
    setShowExpenseDetail(true);
    SetExpenceDetail(order);
  };

  // Sample data for UI display
  const [sampleExpenses, setSampleExpences] = useState([]);

  const [sampleVehicles, SetsampleVehicles] = useState(null);

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "fuel":
        return "bg-blue-100 text-blue-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "fixed costs":
        return "bg-purple-100 text-purple-800";
      case "marketing":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle Add Expense Form Submission
  const onSubmitExpense = async (data) => {
    try {
      console.log("Expense Data:", data);

      const responce = await api.post("/api/user/addexpence", data);
      console.log(responce.data);
      viewExpences();
      toast.success("Expense added successfully!", { duration: 2000 });
      resetExpense();
      setIsAddExpenseModalOpen(false);
      await gettotals();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense. Please try again.", {
        duration: 3000,
      });
    }
  };

  // Handle Add Amount Form Submission
  const onSubmitAmount = async (data) => {
    try {
      console.log("Amount Data:", data);

      // API call example (uncomment when backend is ready)
      const response = await api.post("/api/user/addamount", data);
      if (response.data.success) {
        toast.success("Amount added successfully!", { duration: 2000 });
        resetAmount();
        setIsAddAmountModalOpen(false);
        await gettotals();
      } else {
        toast.error(response.data.message, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding amount:", error);
      toast.error("Failed to add amount. Please try again.", {
        duration: 3000,
      });
    }
  };

  const viewExpences = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewexpences");
      console.log(response.data);

      // Add proper error handling
      if (response.data.success && response.data.expenceData) {
        setSampleExpences(response.data.expenceData);
        SetsampleVehicles(response.data.expenceCount);
      } else {
        // Set to empty array if no data or error
        setSampleExpences([]);
        SetsampleVehicles([]);
        toast.error(response.data.message || "Failed to load expenses", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error loading expense:", error);
      // Set to empty arrays on error to prevent undefined filter
      setSampleExpences([]);
      SetsampleVehicles([]);
      toast.error("Failed to load expense. Please try again.", {
        duration: 3000,
      });
    }
  }, []);

  const getVechilesData = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/viewvehicle");
      console.log(responce.data);
      SetVehicles(responce.data.VehicleData);
    } catch (error) {
      console.log("error in getting vehicle data", error);
    }
  }, []);

  const [balancehistory, setBalanceHistory] = useState([]);

  const getbalancehistory = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/getbalancehistory");
      console.log(responce.data);
      if (responce.data.success) {
        setBalanceHistory(responce.data.balanceHistory || []);
      }
    } catch (error) {
      console.error("Error loading balance history:", error);
      toast.error("Failed to load balance history. Please try again.", {
        duration: 3000,
      });
    }
  }, []);

  const [currentbalance, setCurrentBalance] = useState(0);
  const [totalExpence, setTotalExpence] = useState(0);

  const gettotals = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/gettoalexpncebalance");
      if (responce.data.success) {
        setCurrentBalance(responce.data.balance);
        setTotalExpence(responce.data.totalAmount);
      }
    } catch (error) {
      console.error("Error calculating totals:", error);
      toast.error("Failed to calculate totals. Please try again.", {
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    viewExpences();
    gettotals();
    getVechilesData();
    getbalancehistory();
  }, []);

  // Vehicle Expense Chart Component
  const VehicleExpenseChart = () => {
    if (!sampleVehicles || sampleVehicles.length === 0) {
      return (
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-6">
            Vehicle Expenses Comparison
          </h3>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-500">No vehicle expense data available</p>
          </div>
        </div>
      );
    }

    const maxAmount = Math.max(...sampleVehicles.map((v) => v.totalAmount));
    const totalExpenses = sampleVehicles.reduce(
      (sum, v) => sum + v.totalAmount,
      0
    );

    const gradientColors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-indigo-500 to-indigo-600",
      "from-pink-500 to-pink-600",
      "from-teal-500 to-teal-600",
    ];

    const iconColors = [
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-yellow-500",
      "text-red-500",
      "text-indigo-500",
      "text-pink-500",
      "text-teal-500",
    ];

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Vehicle Expenses Analysis
              </h3>
              <p className="text-gray-300 text-sm">
                Comprehensive breakdown of expenses by vehicle
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl text-white mb-1">🚗</div>
              <div className="text-white text-sm font-medium">
                {sampleVehicles.length} Vehicles
              </div>
            </div>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          <div className="space-y-6">
            {sampleVehicles.map((vehicleData, index) => {
              const percentage =
                maxAmount > 0 ? (vehicleData.totalAmount / maxAmount) * 100 : 0;
              const sharePercentage =
                totalExpenses > 0
                  ? (vehicleData.totalAmount / totalExpenses) * 100
                  : 0;
              const gradientClass =
                gradientColors[index % gradientColors.length];
              const iconColor = iconColors[index % iconColors.length];

              return (
                <div
                  key={index}
                  className="group hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
                >
                  {/* Vehicle Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          <span className="text-white text-lg font-bold">
                            {(vehicleData["vehicleDetails.plateNumber"] || "N/A")
                              .substring(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <span className={`text-xs ${iconColor}`}>🚗</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg uppercase">
                          {vehicleData["vehicleDetails.plateNumber"] ||
                            "Unknown Vehicle"}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {vehicleData.expenseCount} expense
                          {vehicleData.expenseCount !== 1 ? "s" : ""} recorded
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-2xl text-gray-900 mb-1">
                        AED {vehicleData.totalAmount.toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${gradientClass} text-white font-medium`}
                        >
                          {sharePercentage.toFixed(1)}% of total
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${gradientClass} h-4 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Progress indicator */}
                    <div
                      className="absolute top-0 transform -translate-y-8 transition-all duration-1000 ease-out"
                      style={{ left: `${Math.min(percentage, 95)}%` }}
                    >
                      <div
                        className={`bg-gradient-to-r ${gradientClass} text-white text-xs px-2 py-1 rounded shadow-lg`}
                      >
                        {percentage.toFixed(1)}%
                      </div>
                      <div
                        className={`w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800 mx-auto`}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>Relative to highest expense vehicle</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Avg: AED {(vehicleData.totalAmount / vehicleData.expenseCount).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={`w-2 h-2 bg-gradient-to-r ${gradientClass} rounded-full`}></span>
                        Rank: #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>📊 Data updated in real-time</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Balance History Component
  const BalanceHistoryChart = () => {
    if (!balancehistory || balancehistory.length === 0) {
      return (
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-black mb-6">
            Balance History
          </h3>
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💰</div>
            <p className="text-gray-500">No balance history available</p>
          </div>
        </div>
      );
    }

    const maxAmount = Math.max(...balancehistory.map((entry) => entry.amount));
    const minAmount = Math.min(...balancehistory.map((entry) => entry.amount));

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* Balance History Timeline */}
        <div className="p-6">
          <div className="space-y-4">
            {balancehistory.map((entry, index) => {
              const isPositive = entry.type === 'credit' || entry.amount > 0;
              const date = new Date(entry.createdAt || entry.date);
              
              return (
                <div key={index} className="group hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${isPositive ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center shadow-sm`}>
                        <span className={`text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '💰' : '💸'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 uppercase">
                          {entry.description || (isPositive ? 'Amount Added' : 'Expense Deducted')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-xl font-bold ${isPositive ? ' text-red-600' : 'text-green-600'}`}>
                        {isPositive ? '-' : '+'}AED {Math.abs(entry.balance).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Type Badge */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      isPositive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {(entry.type || (isPositive ? 'Credit' : 'Debit')).toUpperCase()}
                    </span>
                    
                    {entry.reference && (
                      <span className="text-xs text-gray-400 uppercase">
                        Ref: {entry.reference}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>💰 Balance history updated in real-time</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  // Add this filtering logic before the return statement
  const filteredExpenses = (sampleExpenses || []).filter((expense) => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase();
    const description = expense.description?.toLowerCase() || "";
    const vehicleNumber =
      expense["vehicleDetails.plateNumber"]?.toLowerCase() || "";

    return (
      description.includes(searchLower) || vehicleNumber.includes(searchLower)
    );
  });

  const checkAccountLogin = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/user/authcheck");
      console.log(response.data);
      if (response.data.authenticated === true) {
        setLoading(false);
        // Load all data after authentication check
        await Promise.all([
          viewExpences(),
          gettotals(),
          getVechilesData(),
          getbalancehistory(),
        ]);
      } else {
        navigate("/signin");
      }
      setLoading(false);
    } catch (error) {
      console.log("error in checking user login", error);
      setLoading(false);
      navigate("/signin");
    } finally {
      setLoading(false);
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
        <div className="flex min-h-screen bg-white">
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
                  Expenses
                </h1>

                {/* Mobile Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddAmountModalOpen(true)}
                    className="bg-gray-800 text-white px-2 py-1 text-xs rounded"
                  >
                    Amount
                  </button>
                  <button
                    onClick={() => setIsAddExpenseModalOpen(true)}
                    className="bg-black text-white px-2 py-1 text-xs rounded"
                  >
                    Expense
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-gray-200 bg-white">
              <div className="px-4 sm:px-8 py-4 md:py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-black">
                      Expense Management
                    </h1>
                    <p className="text-gray-600 text-xs md:text-sm mt-1">
                      Track and manage your business expenses
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setIsAddAmountModalOpen(true)}
                      className="bg-gray-800 text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-700 transition-colors w-full sm:w-auto"
                    >
                      Add Amount
                    </button>
                    <button
                      onClick={() => setIsAddExpenseModalOpen(true)}
                      className="bg-black text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 lg:p-8">
              {/* Search and Tabs */}
              <div className="mb-6 lg:mb-8">
                {/* Search Bar */}
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    placeholder="Search by vehicle number or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm lg:text-base"
                  />
                  {searchTerm && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing results for: "{searchTerm}" (
                      {filteredExpenses.length} found)
                    </p>
                  )}
                </div>

                {/* Tabs - Mobile Scrollable */}
                <div className="flex overflow-x-auto border-b border-gray-200 mb-4 lg:mb-6 scrollbar-hide">
                  <div className="flex space-x-0 min-w-max">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "all"
                          ? "border-black text-black"
                          : "border-transparent text-gray-600 hover:text-black"
                      }`}
                    >
                      All Expenses
                    </button>
                    <button
                      onClick={() => setActiveTab("vehicle")}
                      className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "vehicle"
                          ? "border-black text-black"
                          : "border-transparent text-gray-600 hover:text-black"
                      }`}
                    >
                      View by Vehicle
                    </button>
                    <button
                      onClick={() => setActiveTab("history")}
                      className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "history"
                          ? "border-black text-black"
                          : "border-transparent text-gray-600 hover:text-black"
                      }`}
                    >
                      Balance History
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-6 lg:mb-8">
                <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                  <div className="text-xs lg:text-sm text-gray-600">
                    Total Expenses
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-red-600 mt-2">
                    AED {totalExpence}
                  </div>
                </div>
                <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                  <div className="text-xs lg:text-sm text-gray-600">
                    Current Balance
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-blue-600 mt-2">
                    AED {currentbalance}
                  </div>
                </div>
              </div>

              {/* Conditional Content Based on Active Tab */}
              {activeTab === "vehicle" ? (
                /* Vehicle Expense Chart */
                <VehicleExpenseChart />
              ) : activeTab === "history" ? (
                /* Balance History Chart */
                <BalanceHistoryChart />
              ) : (
                /* Expenses Table - Mobile Cards + Desktop Table */
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <div className="bg-black text-white">
                      <div className="grid grid-cols-7 gap-4 px-6 py-4 text-sm font-medium">
                        <div>Description</div>
                        <div>Category</div>
                        <div>Amount</div>
                        <div>Vehicle</div>
                        <div>Date</div>
                        <div>Type</div>
                        <div>Actions</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => handleExpencedetail(expense)}
                          >
                            <div className="font-medium text-black truncate uppercase">
                              {expense.description}
                            </div>
                            <div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                                  expense.category
                                )}`}
                              >
                                {expense.category.toUpperCase()}
                              </span>
                            </div>
                            <div className="font-medium text-red-600">
                              AED {expense.amount.toFixed(2)}
                            </div>
                            <div className="text-gray-600 truncate uppercase">
                              {expense["vehicleDetails.plateNumber"] || "N/A"}
                            </div>
                            <div className="text-gray-600">
                              {expense.createdAt.split("T")[0]}
                            </div>
                            <div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  expense.type === "vehicle"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {expense["vehicleDetails.type"]?.toUpperCase() || "VEHICLE"}
                              </span>
                            </div>
                            <div onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setShowExpenseDetail(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <div className="text-gray-400 text-4xl mb-4">🔍</div>
                          <p className="text-gray-500 text-lg mb-2">No expenses found</p>
                          <p className="text-gray-400 text-sm">
                            Try adjusting your search terms for "{searchTerm.toUpperCase()}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="lg:hidden space-y-3 p-3">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          onClick={() => handleExpencedetail(expense)}
                          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate uppercase">
                                {expense.description}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 uppercase">
                                {expense["vehicleDetails.plateNumber"] || "N/A"}
                              </p>
                            </div>
                            <div className="text-right ml-3">
                              <div className="font-bold text-red-600">
                                AED {expense.amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {expense.createdAt.split("T")[0]}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                                expense.category
                              )}`}
                            >
                              {expense.category.toUpperCase()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExpencedetail(expense);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">🔍</div>
                        <p className="text-gray-500 text-base mb-2">No expenses found</p>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search terms for "{searchTerm.toUpperCase()}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Add Expense Modal - Enhanced Responsive */}
          {isAddExpenseModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                {/* Modal Header */}
                <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-medium">Add New Expense</h3>
                  <button
                    onClick={() => setIsAddExpenseModalOpen(false)}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <form
                  onSubmit={handleSubmitExpense(onSubmitExpense)}
                  className="p-4 sm:p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Description *
                      </label>
                      <input
                        type="text"
                        {...registerExpense("description", {
                          required: "Description is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter expense description"
                      />
                      {expenseErrors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {expenseErrors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...registerExpense("amount", {
                          required: "Amount is required",
                          min: {
                            value: 0.01,
                            message: "Amount must be greater than 0",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                      {expenseErrors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {expenseErrors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Category *
                      </label>
                      <select
                        {...registerExpense("category", {
                          required: "Category is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Fuel">Fuel</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Fixed Costs">Fixed Costs</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Insurance">Insurance</option>
                        <option value="Other">Other</option>
                      </select>
                      {expenseErrors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {expenseErrors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Vehicle 
                      </label>
                      <select
                        {...registerExpense("vehicleId",{required: "Vehicle is required"})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="">Select Vehicle</option>
                        {Vehicles.map((item) => (
                          <option key={item.id} value={item.id} className="uppercase">
                            {item.plateNumber}
                          </option>
                        ))}
                      </select>
                      {expenseErrors.vehicleId && (
                        <p className="text-red-500 text-xs mt-1">
                          {expenseErrors.vehicleId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        {...registerExpense("date", {
                          required: "Date is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      />
                      {expenseErrors.date && (
                        <p className="text-red-500 text-xs mt-1">
                          {expenseErrors.date.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Remarks
                      </label>
                      <textarea
                        {...registerExpense("remarks")}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm resize-none uppercase"
                        placeholder="Additional notes or remarks"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsAddExpenseModalOpen(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
                    >
                      Add Expense
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Amount Modal - Enhanced Responsive */}
          {isAddAmountModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg m-2">
                {/* Modal Header */}
                <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-medium">Add Amount</h3>
                  <button
                    onClick={() => setIsAddAmountModalOpen(false)}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmitAmount(onSubmitAmount)} className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...registerAmount("amount", {
                          required: "Amount is required",
                          min: {
                            value: 0.01,
                            message: "Amount must be greater than 0",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                      {amountErrors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {amountErrors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        {...registerAmount("description")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Brief description (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        {...registerAmount("date", {
                          required: "Date is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      />
                      {amountErrors.date && (
                        <p className="text-red-500 text-xs mt-1">
                          {amountErrors.date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsAddAmountModalOpen(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
                    >
                      Add Amount
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Expense Detail Modal - Enhanced Responsive */}
          {showExpenseDetail && expencedetail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-medium">Expense Details</h3>
                  <button
                    onClick={() => setShowExpenseDetail(false)}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Expense Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                        Expense Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Description:</span>
                          <span className="font-medium text-sm break-words uppercase">
                            {expencedetail.description || `${expencedetail.category} for Vehicle ${expencedetail["vehicleDetails.plateNumber"]}`}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Amount:</span>
                          <span className="font-bold text-red-600">
                            AED {expencedetail.amount}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Category:</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 w-fit">
                            {expencedetail.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Date:</span>
                          <span className="font-medium text-sm">
                            {expencedetail.createdAt.split("T")[0]}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Type:</span>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 w-fit">
                            VEHICLE
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                        Vehicle Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Plate Number:</span>
                          <span className="font-medium text-sm uppercase">
                            {expencedetail["vehicleDetails.plateNumber"]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="mt-6">
                    <h4 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                      Remarks
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm uppercase">
                      {expencedetail.remarks || "No remarks"}
                    </p>
                  </div>

                  <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowExpenseDetail(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Expence;

import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Expence = () => {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [Vehicles, SetVehicles] = useState([]);
  // const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form for Add Expense
  const {
    register: registerExpense,
    handleSubmit: handleSubmitExpense,
    reset: resetExpense,
    watch: watchExpense,
    formState: { errors: expenseErrors },
  } = useForm({
    defaultValues: {
      description: "",
      amount: "",
      category: "Fuel",
      vehicleId: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
      // Add new fuel-specific fields
      quantity: "",
      dhs: "",
      fills: "",
      fuelStation: "",
      billInvoice: "",
      // Add maintenance-specific fields
      maintenanceShop: "",
      maintenanceBillNo: "",
    },
  });

  // Form for Edit Expense
  const {
    register: registerEditExpense,
    handleSubmit: handleSubmitEditExpense,
    reset: resetEditExpense,
    setValue: setEditValue,
    watch: watchEditExpense,
    formState: { errors: editExpenseErrors },
  } = useForm({
    defaultValues: {
      description: "",
      amount: "",
      category: "Fuel",
      vehicleId: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
      // Add new fuel-specific fields
      quantity: "",
      dhs: "",
      fills: "",
      fuelStation: "",
      billInvoice: "",
      // Add maintenance-specific fields
      maintenanceShop: "",
      maintenanceBillNo: "",
    },
  });

  // Watch category changes
  const selectedCategory = watchExpense("category");
  const selectedEditCategory = watchEditExpense("category");

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
      const responce = await api.post("/api/user/addexpence", data);

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

  // Handle Edit Expense Form Submission
  const onSubmitEditExpense = async (data) => {
    try {
      const response = await api.put(
        `/api/user/editexpence/${editingExpense.id}`,
        data
      );
      console.log(response.data);

      if (response.data.success) {
        viewExpences();
        toast.success("Expense updated successfully!", { duration: 2000 });
        resetEditExpense();
        setIsEditExpenseModalOpen(false);
        setEditingExpense(null);
        await gettotals();
      } else {
        toast.error(response.data.message || "Failed to update expense", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("Failed to update expense. Please try again.", {
        duration: 3000,
      });
    }
  };

  // Handle Edit Expense Click
  const handleEditExpense = (expense) => {
    console.log(expense);
    
    setEditingExpense(expense);

    // Pre-populate form with expense data
    setEditValue("description", expense.description || "");
    setEditValue("amount", expense.amount || "");
    setEditValue("category", expense.category || "Fuel");
    setEditValue("vehicleId", expense.vehicle || expense.vehicleId || "");
    setEditValue(
      "date",
      expense.date
        ? expense.date.split("T")[0]
        : expense.createdAt
        ? expense.createdAt.split("T")[0]
        : new Date().toISOString().split("T")[0]
    );
    setEditValue("remarks", expense.remarks || "");

    // Add fuel-specific fields
    setEditValue("quantity", expense.quantity || "");
    setEditValue("dhs", expense.dhs || "");
    setEditValue("fills", expense.fills || "");
    setEditValue("fuelStation", expense.fuelStation || "");
    setEditValue("billInvoice", expense.billInvoice || "");

    // Add maintenance-specific fields
    setEditValue("maintenanceShop", expense.maintenanceShop || "");
    setEditValue("maintenanceBillNo", expense.maintenanceBillNo || "");

    setIsEditExpenseModalOpen(true);
  };

  // Handle Add Amount Form Submission
  const onSubmitAmount = async (data) => {
    try {
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

      SetVehicles(responce.data.VehicleData);
    } catch (error) {
      console.log("error in getting vehicle data", error);
    }
  }, []);

  // Add new state for mechanics/shops
  const [mechanics, setMechanics] = useState([]);

  // Add function to fetch mechanics data
  const getMechanicsData = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewmechanic");
      if (response.data.success) {
        setMechanics(response.data.mechanicsData);
      }
      console.log(response.data);
      
    } catch (error) {
      console.log("error in getting mechanics data", error);
    }
  }, []);

  const [balancehistory, setBalanceHistory] = useState([]);

  const getbalancehistory = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/getbalancehistory");

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
    getMechanicsData();
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
                            {(
                              vehicleData["vehicleDetails.plateNumber"] || "N/A"
                            )
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
                        Avg: AED{" "}
                        {(
                          vehicleData.totalAmount / vehicleData.expenseCount
                        ).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 bg-gradient-to-r ${gradientClass} rounded-full`}
                        ></span>
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
              const isPositive = entry.type === "credit" || entry.amount > 0;
              const date = new Date(entry.createdAt || entry.date);

              return (
                <div
                  key={index}
                  className="group hover:bg-gray-50 p-4 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${
                          isPositive ? "bg-green-100" : "bg-red-100"
                        } rounded-full flex items-center justify-center shadow-sm`}
                      >
                        <span
                          className={`text-lg ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? "💰" : "💸"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 uppercase">
                          {entry.description ||
                            (isPositive ? "Amount Added" : "Expense Deducted")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {date.toLocaleDateString()} at{" "}
                          {date.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-xl font-bold ${
                          isPositive ? " text-red-600" : "text-green-600"
                        }`}
                      >
                        {isPositive ? "-" : "+"}AED{" "}
                        {Math.abs(entry.balance).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Transaction Type Badge */}
                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        isPositive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(
                        entry.type || (isPositive ? "Credit" : "Debit")
                      ).toUpperCase()}
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

  const GALLON_TO_LITER = 3.78541; 


  const gallonsToLiters = (gallons) => {
    return gallons ? (parseFloat(gallons) * GALLON_TO_LITER).toFixed(2) : '0.00';
  };

  const litersToGallons = (liters) => {
    return liters ? (parseFloat(liters) / GALLON_TO_LITER).toFixed(2) : '0.00';
  };


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

      if (response.data.authenticated === true) {
        setLoading(false);
        
        await Promise.all([
          viewExpences(),
          gettotals(),
          getVechilesData(),
          getbalancehistory(),
          getMechanicsData() // Add this line
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
                  {/* <button
                    onClick={() => setIsAddAmountModalOpen(true)}
                    className="bg-gray-800 text-white px-2 py-1 text-xs rounded"
                  >
                    Amount
                  </button> */}
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
                    {/* <button
                      onClick={() => setIsAddAmountModalOpen(true)}
                      className="bg-gray-800 text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-700 transition-colors w-full sm:w-auto"
                    >
                      Add Amount
                    </button> */}
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
                    {/* <button
                      onClick={() => setActiveTab("history")}
                      className={`px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "history"
                          ? "border-black text-black"
                          : "border-transparent text-gray-600 hover:text-black"
                      }`}
                    >
                      Balance History
                    </button> */}
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
                            className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors"
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
                              {expense.date.split("T")[0]}
                            </div>
                            <div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  expense.type === "vehicle"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {expense[
                                  "vehicleDetails.type"
                                ]?.toUpperCase() || "VEHICLE"}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleExpencedetail(expense)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditExpense(expense)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center">
                          <div className="text-gray-400 text-4xl mb-4">🔍</div>
                          <p className="text-gray-500 text-lg mb-2">
                            No expenses found
                          </p>
                          <p className="text-gray-400 text-sm">
                            Try adjusting your search terms for "
                            {searchTerm.toUpperCase()}"
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
                          className="bg-white border border-gray-200 rounded-lg p-4"
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
                                {expense.date.split("T")[0]}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                                expense.category
                              )}`}
                            >
                              {expense.category.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleExpencedetail(expense)}
                              className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-600 hover:border-blue-800 rounded px-3 py-1"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditExpense(expense)}
                              className="flex-1 text-green-600 hover:text-green-800 text-sm font-medium border border-green-600 hover:border-green-800 rounded px-3 py-1"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">🔍</div>
                        <p className="text-gray-500 text-base mb-2">
                          No expenses found
                        </p>
                        <p className="text-gray-400 text-sm">
                          Try adjusting your search terms for "
                          {searchTerm.toUpperCase()}"
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
                  <h3 className="text-base sm:text-lg font-medium">
                    Add New Expense
                  </h3>
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
                        Vehicle *
                      </label>
                      <select
                        {...registerExpense("vehicleId", {
                          required: "Vehicle is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="">Select Vehicle</option>
                        {Vehicles.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                            className="uppercase"
                          >
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

                    {/* Maintenance-specific fields - Only show when category is Maintenance */}
                    {selectedCategory === "Maintenance" && (
                      <>
                        {/* Maintenance Section Header */}
                        <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm">🔧</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Maintenance Details
                            </h4>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Shop Name *
                          </label>
                          <select
                            {...registerExpense("maintenanceShop", {
                              required:
                                selectedCategory === "Maintenance"
                                  ? "Shop name is required for maintenance expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                          >
                            <option value="">Select Maintenance Shop</option>
                            {mechanics.map((mechanic) => (
                              <option
                                key={mechanic.id}
                                value={mechanic.shopName}
                                className="uppercase"
                              >
                                {mechanic.shopName}
                              </option>
                            ))}
                          </select>
                          {expenseErrors.maintenanceShop && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.maintenanceShop.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Bill Number *
                          </label>
                          <input
                            type="text"
                            {...registerExpense("maintenanceBillNo", {
                              required:
                                selectedCategory === "Maintenance"
                                  ? "Bill number is required for maintenance expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter bill/invoice number"
                          />
                          {expenseErrors.maintenanceBillNo && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.maintenanceBillNo.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Fuel-specific fields - Only show when category is Fuel */}
                    {selectedCategory === "Fuel" && (
                      <>
                        {/* Fuel Section Header */}
                        <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">⛽</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Fuel Details
                            </h4>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Fuel Station *
                          </label>
                          <input
                            type="text"
                            {...registerExpense("fuelStation", {
                              required:
                                selectedCategory === "Fuel"
                                  ? "Fuel station is required for fuel expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter fuel station name (e.g., ADNOC, ENOC, EPPCO)"
                          />
                          {expenseErrors.fuelStation && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.fuelStation.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Bill/Invoice Number *
                          </label>
                          <input
                            type="text"
                            {...registerExpense("billInvoice", {
                              required:
                                selectedCategory === "Fuel"
                                  ? "Bill/Invoice number is required for fuel expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter bill/invoice number"
                          />
                          {expenseErrors.billInvoice && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.billInvoice.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Quantity (Gallons) *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              {...registerExpense("quantity", {
                                required:
                                  selectedCategory === "Fuel"
                                    ? "Quantity is required for fuel expenses"
                                    : false,
                                min: {
                                  value: 0.01,
                                  message: "Quantity must be greater than 0",
                                },
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm pr-12"
                              placeholder="0.00"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              Gal
                            </span>
                          </div>
                          {/* Display conversion to liters */}
                          {watchExpense("quantity") && (
                            <div className="mt-1 text-xs text-blue-600">
                              ≈ {gallonsToLiters(watchExpense("quantity"))} Liters
                            </div>
                          )}
                          {expenseErrors.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.quantity.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Price per Gallon (AED) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              AED
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              {...registerExpense("dhs", {
                                required:
                                  selectedCategory === "Fuel"
                                    ? "Price per gallon is required for fuel expenses"
                                    : false,
                                min: {
                                  value: 0.01,
                                  message: "Price must be greater than 0",
                                },
                              })}
                              className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                              placeholder="0.00"
                            />
                          </div>
                          {expenseErrors.dhs && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.dhs.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Number of Fills *
                          </label>
                          <input
                            type="number"
                            {...registerExpense("fills", {
                              required:
                                selectedCategory === "Fuel"
                                  ? "Number of fills is required for fuel expenses"
                                  : false,
                              min: {
                                value: 1,
                                message: "Number of fills must be at least 1",
                              },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                            placeholder="1"
                          />
                          {expenseErrors.fills && (
                            <p className="text-red-500 text-xs mt-1">
                              {expenseErrors.fills.message}
                            </p>
                          )}
                        </div>

                        {/* Fuel Calculation Display */}
                        <div className="sm:col-span-2">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">
                              📊 Fuel Calculation Summary
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-700">
                                  Total Quantity:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  {watchExpense("quantity") || "0"} Gal
                                </span>
                                <div className="text-xs text-blue-600">
                                  (≈ {gallonsToLiters(watchExpense("quantity"))} L)
                                </div>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Rate per Gallon:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  AED {watchExpense("dhs") || "0.00"}
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Number of Fills:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  {watchExpense("fills") || "0"}
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Calculated Total:
                                </span>
                                <span className="font-bold text-blue-900 ml-2">
                                  AED{" "}
                                  {(
                                    (parseFloat(watchExpense("quantity")) ||
                                      0) *
                                    (parseFloat(watchExpense("dhs")) || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-blue-600">
                              💡 Tip: Enter quantity in gallons, price per gallon in AED
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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

          {/* Edit Expense Modal - Similar conditional structure */}
          {isEditExpenseModalOpen && editingExpense && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                {/* Modal Header */}
                <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-medium">
                    Edit Expense
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditExpenseModalOpen(false);
                      setEditingExpense(null);
                      resetEditExpense();
                    }}
                    className="text-white hover:text-gray-300 text-xl"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Body */}
                <form
                  onSubmit={handleSubmitEditExpense(onSubmitEditExpense)}
                  className="p-4 sm:p-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Description *
                      </label>
                      <input
                        type="text"
                        {...registerEditExpense("description", {
                          required: "Description is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter expense description"
                      />
                      {editExpenseErrors.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {editExpenseErrors.description.message}
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
                        {...registerEditExpense("amount", {
                          required: "Amount is required",
                          min: {
                            value: 0.01,
                            message: "Amount must be greater than 0",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="0.00"
                      />
                      {editExpenseErrors.amount && (
                        <p className="text-red-500 text-xs mt-1">
                          {editExpenseErrors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Category *
                      </label>
                      <select
                        {...registerEditExpense("category", {
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
                      {editExpenseErrors.category && (
                        <p className="text-red-500 text-xs mt-1">
                          {editExpenseErrors.category.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Vehicle
                      </label>
                      <select
                        {...registerEditExpense("vehicleId", {
                          required: "Vehicle is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="">Select Vehicle</option>
                        {Vehicles.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                            className="uppercase"
                          >
                            {item.plateNumber}
                          </option>
                        ))}
                      </select>
                      {editExpenseErrors.vehicleId && (
                        <p className="text-red-500 text-xs mt-1">
                          {editExpenseErrors.vehicleId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        {...registerEditExpense("date", {
                          required: "Date is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      />
                      {editExpenseErrors.date && (
                        <p className="text-red-500 text-xs mt-1">
                          {editExpenseErrors.date.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Remarks
                      </label>
                      <textarea
                        {...registerEditExpense("remarks")}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm resize-none uppercase"
                        placeholder="Additional notes or remarks"
                      />
                    </div>
</div>
                    {/* Fuel-specific fields for Edit - Only show when category is Fuel */}
                    {selectedEditCategory === "Fuel" && (
                      <>
                        {/* Fuel Section Header */}
                        <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">⛽</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Fuel Details
                            </h4>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Fuel Station *
                          </label>
                          <input
                            type="text"
                            {...registerEditExpense("fuelStation", {
                              required:
                                selectedEditCategory === "Fuel"
                                  ? "Fuel station is required for fuel expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter fuel station name (e.g., ADNOC, ENOC, EPPCO)"
                          />
                          {editExpenseErrors.fuelStation && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.fuelStation.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Bill/Invoice Number *
                          </label>
                          <input
                            type="text"
                            {...registerEditExpense("billInvoice", {
                              required:
                                selectedEditCategory === "Fuel"
                                  ? "Bill/Invoice number is required for fuel expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter bill/invoice number"
                          />
                          {editExpenseErrors.billInvoice && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.billInvoice.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Quantity (Gallons) *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              {...registerEditExpense("quantity", {
                                required:
                                  selectedEditCategory === "Fuel"
                                    ? "Quantity is required for fuel expenses"
                                    : false,
                                min: {
                                  value: 0.01,
                                  message: "Quantity must be greater than 0",
                                },
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm pr-12"
                              placeholder="0.00"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              Gal
                            </span>
                          </div>
                          {/* Display conversion to liters */}
                          {watchEditExpense("quantity") && (
                            <div className="mt-1 text-xs text-blue-600">
                              ≈ {gallonsToLiters(watchEditExpense("quantity"))} Liters
                            </div>
                          )}
                          {editExpenseErrors.quantity && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.quantity.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Price per Gallon (AED) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                              AED
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              {...registerEditExpense("dhs", {
                                required:
                                  selectedEditCategory === "Fuel"
                                    ? "Price per gallon is required for fuel expenses"
                                    : false,
                                min: {
                                  value: 0.01,
                                  message: "Price must be greater than 0",
                                },
                              })}
                              className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                              placeholder="0.00"
                            />
                          </div>
                          {editExpenseErrors.dhs && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.dhs.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Number of Fills *
                          </label>
                          <input
                            type="number"
                            {...registerEditExpense("fills", {
                              required:
                                selectedEditCategory === "Fuel"
                                  ? "Number of fills is required for fuel expenses"
                                  : false,
                              min: {
                                value: 1,
                                message: "Number of fills must be at least 1",
                              },
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                            placeholder="1"
                          />
                          {editExpenseErrors.fills && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.fills.message}
                            </p>
                          )}
                        </div>

                        {/* Fuel Calculation Display for Edit */}
                        <div className="sm:col-span-2">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">
                              📊 Fuel Calculation Summary
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-700">
                                  Total Quantity:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  {watchEditExpense("quantity") || "0"} Gal
                                </span>
                                <div className="text-xs text-blue-600">
                                  (≈ {gallonsToLiters(watchEditExpense("quantity"))} L)
                                </div>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Rate per Gallon:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  AED {watchEditExpense("dhs") || "0.00"}
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Number of Fills:
                                </span>
                                <span className="font-medium text-blue-900 ml-2">
                                  {watchEditExpense("fills") || "0"}
                                </span>
                              </div>
                              <div>
                                <span className="text-blue-700">
                                  Calculated Total:
                                </span>
                                <span className="font-bold text-blue-900 ml-2">
                                  AED{" "}
                                  {(
                                    (parseFloat(watchEditExpense("quantity")) ||
                                      0) *
                                    (parseFloat(watchEditExpense("dhs")) || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-blue-600">
                              💡 Tip: Enter quantity in gallons, price per gallon in AED
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Maintenance-specific fields for Edit - Only show when category is Maintenance */}
                    {selectedEditCategory === "Maintenance" && (
                      <>
                        {/* Maintenance Section Header */}
                        <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm">🔧</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              Maintenance Details
                            </h4>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Shop Name *
                          </label>
                          <select
                            {...registerEditExpense("maintenanceShop", {
                              required:
                                selectedEditCategory === "Maintenance"
                                  ? "Shop name is required for maintenance expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                          >
                            <option value="">Select Maintenance Shop</option>
                            {mechanics.map((mechanic) => (
                              <option
                                key={mechanic.id}
                                value={mechanic.shopName}
                                className="uppercase"
                              >
                                {mechanic.shopName}
                              </option>
                            ))}
                          </select>
                          {editExpenseErrors.maintenanceShop && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.maintenanceShop.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-black mb-2">
                            Bill Number *
                          </label>
                          <input
                            type="text"
                            {...registerEditExpense("maintenanceBillNo", {
                              required:
                                selectedEditCategory === "Maintenance"
                                  ? "Bill number is required for maintenance expenses"
                                  : false,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                            placeholder="Enter bill/invoice number"
                          />
                          {editExpenseErrors.maintenanceBillNo && (
                            <p className="text-red-500 text-xs mt-1">
                              {editExpenseErrors.maintenanceBillNo.message}
                            </p>
                          )}
                        </div>

                        {/* Maintenance Summary */}
                        <div className="sm:col-span-2">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-yellow-900 mb-2">
                              🔧 Maintenance Summary
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-yellow-700">Shop Name:</span>
                                <span className="font-medium text-yellow-900 ml-2">
                                  {watchEditExpense("maintenanceShop") || "Not selected"}
                                </span>
                              </div>
                              <div>
                                <span className="text-yellow-700">Bill Number:</span>
                                <span className="font-medium text-yellow-900 ml-2">
                                  {watchEditExpense("maintenanceBillNo") || "Not specified"}
                                </span>
                              </div>
                              <div>
                                <span className="text-yellow-700">Total Cost:</span>
                                <span className="font-bold text-yellow-900 ml-2">
                                  AED {watchEditExpense("amount") || "0.00"}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-yellow-600">
                              🔧 Maintenance expense for vehicle repair/service
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Modal Footer */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditExpenseModalOpen(false);
                          setEditingExpense(null);
                          resetEditExpense();
                        }}
                        className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
                      >
                        Update Expense
                      </button>
                    </div>
                </form>
              </div>
            </div>
          )}

          {/* Expense Detail Modal - Enhanced with fuel details */}
          {showExpenseDetail && expencedetail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
                  <h3 className="text-base sm:text-lg font-medium">
                    Expense Details
                  </h3>
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
                          <span className="text-gray-600 text-sm">
                            Description:
                          </span>
                          <span className="font-medium text-sm break-words uppercase">
                            {expencedetail.description ||
                              `${expencedetail.category} for Vehicle ${expencedetail["vehicleDetails.plateNumber"]}`}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Amount:</span>
                          <span className="font-bold text-red-600">
                            AED {expencedetail.amount}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">
                            Category:
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 w-fit">
                            {expencedetail.category.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                          <span className="text-gray-600 text-sm">Date:</span>
                          <span className="font-medium text-sm">
                            {expencedetail.date.split("T")[0]}
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
                          <span className="text-gray-600 text-sm">
                            Plate Number:
                          </span>
                          <span className="font-medium text-sm uppercase">
                            {expencedetail["vehicleDetails.plateNumber"]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fuel-specific details - Only show if category is Fuel */}
                  {expencedetail.category === "Fuel" && (
                    <div className="mt-6">
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-sm">⛽</span>
                          </div>
                          <h4 className="text-lg font-semibold text-black">
                            Fuel Details
                          </h4>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {expencedetail.fuelStation && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                <span className="text-blue-700 text-sm font-medium">
                                  Fuel Station:
                                </span>
                                <span className="font-semibold text-blue-900 uppercase">
                                  {expencedetail.fuelStation}
                                </span>
                              </div>
                            )}
                            {expencedetail.billInvoice && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                <span className="text-blue-700 text-sm font-medium">
                                  Bill/Invoice:
                                </span>
                                <span className="font-semibold text-blue-900 uppercase">
                                  {expencedetail.billInvoice}
                                </span>
                              </div>
                            )}
                            {expencedetail.quantity && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                <span className="text-blue-700 text-sm font-medium">
                                  Quantity:
                                </span>
                                <span className="font-semibold text-blue-900">
                                  {expencedetail.quantity} Gallons
                                  <div className="text-xs text-blue-600">
                                    (≈ {gallonsToLiters(expencedetail.quantity)} Liters)
                                  </div>
                                </span>
                              </div>
                            )}
                            {expencedetail.dhs && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                <span className="text-blue-700 text-sm font-medium">
                                  Price per Gallon:
                                </span>
                                <span className="font-semibold text-blue-900">
                                  AED {expencedetail.dhs}
                                </span>
                              </div>
                            )}
                            {expencedetail.fills && (
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                                <span className="text-blue-700 text-sm font-medium">
                                  Number of Fills:
                                </span>
                                <span className="font-semibold text-blue-900">
                                  {expencedetail.fills}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Calculation Summary */}
                          {expencedetail.quantity && expencedetail.dhs && (
                            <div className="mt-4 pt-4 border-t border-blue-200">
                              <div className="flex justify-between items-center">
                                <span className="text-blue-700 text-sm font-medium">
                                  Calculated Total:
                                </span>
                                <span className="font-bold text-blue-900 text-lg">
                                  AED{" "}
                                  {(
                                    parseFloat(expencedetail.quantity) *
                                    parseFloat(expencedetail.dhs)
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                {expencedetail.quantity} Gal × AED{" "}
                                {expencedetail.dhs} = AED{" "}
                                {(
                                  parseFloat(expencedetail.quantity) *
                                  parseFloat(expencedetail.dhs)
                                ).toFixed(2)}
                                <br />
                                Equivalent: {gallonsToLiters(expencedetail.quantity)} L × AED{" "}
                                {(parseFloat(expencedetail.dhs) / GALLON_TO_LITER).toFixed(3)} per L
                              </div>

                              {/* Show variance if calculated total differs from actual amount */}
                              {(
                                parseFloat(expencedetail.quantity) *
                                parseFloat(expencedetail.dhs)
                              ).toFixed(2) !==
                                parseFloat(expencedetail.amount).toFixed(2) && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-600 text-sm">
                                      ⚠️
                                    </span>
                                    <span className="text-yellow-800 text-xs font-medium">
                                      Note: Calculated total (AED{" "}
                                      {(
                                        parseFloat(expencedetail.quantity) *
                                        parseFloat(expencedetail.dhs)
                                      ).toFixed(2)}
                                      ) differs from actual amount (AED{" "}
                                      {parseFloat(expencedetail.amount).toFixed(
                                        2
                                      )}
                                      )
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Fuel Efficiency Display */}
                          {expencedetail.quantity && expencedetail.fills && (
                            <div className="mt-4 pt-4 border-t border-blue-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-blue-700">
                                    Avg per Fill:
                                  </span>
                                  <span className="font-medium text-blue-900">
                                    {(
                                      parseFloat(expencedetail.quantity) /
                                      parseFloat(expencedetail.fills)
                                    ).toFixed(2)}{" "}
                                    Gal
                                    <div className="text-xs text-blue-600">
                                      (≈ {gallonsToLiters(
                                        parseFloat(expencedetail.quantity) /
                                        parseFloat(expencedetail.fills)
                                      )} L)
                                    </div>
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">
                                    Cost per Fill:
                                  </span>
                                  <span className="font-medium text-blue-900">
                                    AED{" "}
                                    {(
                                      parseFloat(expencedetail.amount) /
                                      parseFloat(expencedetail.fills)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

{expencedetail.category === "Maintenance" && (
  <div className="mt-6">
    <div className="border-t border-gray-200 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <span className="text-yellow-600 text-sm">🔧</span>
        </div>
        <h4 className="text-lg font-semibold text-black">
          Maintenance Details
        </h4>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expencedetail.maintenanceShop && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-yellow-700 text-sm font-medium">
                Shop Name:
              </span>
              <span className="font-semibold text-yellow-900 uppercase">
                {expencedetail.maintenanceShop}
              </span>
            </div>
          )}
          {expencedetail.maintenanceBillNo && (
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-yellow-700 text-sm font-medium">
                Bill Number:
              </span>
              <span className="font-semibold text-yellow-900 uppercase">
                {expencedetail.maintenanceBillNo}
              </span>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-yellow-700 text-sm font-medium">
              Service Type:
            </span>
            <span className="font-semibold text-yellow-900">
              {expencedetail.category.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-yellow-700 text-sm font-medium">
              Service Date:
            </span>
            <span className="font-semibold text-yellow-900">
              {expencedetail.date.split("T")[0]}
            </span>
          </div>
        </div>

        {/* Maintenance Summary */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="flex justify-between items-center">
            <span className="text-yellow-700 text-sm font-medium">
              Total Service Cost:
            </span>
            <span className="font-bold text-yellow-900 text-lg">
              AED {parseFloat(expencedetail.amount).toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-yellow-600 mt-1">
            Maintenance service performed on {expencedetail.date.split("T")[0]}
          </div>
        </div>

        {/* Service Information */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-yellow-700">
                Vehicle:
              </span>
              <span className="font-medium text-yellow-900 uppercase">
                {expencedetail["vehicleDetails.plateNumber"]}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-700">
                Service Category:
              </span>
              <span className="font-medium text-yellow-900">
                MAINTENANCE
              </span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 text-sm">🔧</span>
            <span className="text-yellow-800 text-xs font-medium">
              Maintenance Service Details
            </span>
          </div>
          <div className="mt-2 text-xs text-yellow-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {expencedetail.maintenanceShop && (
                <div>• Shop: {expencedetail.maintenanceShop}</div>
              )}
              {expencedetail.maintenanceBillNo && (
                <div>• Bill: {expencedetail.maintenanceBillNo}</div>
              )}
              <div>• Cost: AED {parseFloat(expencedetail.amount).toFixed(2)}</div>
              <div>• Date: {expencedetail.date.split("T")[0]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


                  {/* Remarks */}
                  <div className="mt-6">
                    <h4 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                      Remarks
                    </h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm uppercase">
                      {expencedetail.remarks || "No remarks"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowExpenseDetail(false);
                        handleEditExpense(expencedetail);
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg"
                    >
                      Edit Expense
                    </button>
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

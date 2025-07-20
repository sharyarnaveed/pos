import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaGasPump,
  FaTools,
  FaBolt,
  FaCogs,
  FaBuilding,
  FaHome,
  FaCar,
  FaUserTie,
  FaIdBadge,
  FaGlobe,
  FaMoneyBill,
  FaRoad,
  FaEllipsisH,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

import Spinner from "../components/Spinner";
import ViewExpenseDetail from "./components/ViewExpenseDetail";
import AddExpenseModal from "./components/AddExpenseModal";
import EditExpenseModal from "./components/EditExpenseModal";

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
      driverId: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
      quantity: "",
      dhs: "",
      fills: "",
      fuelStation: "",
      billInvoice: "",
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

      quantity: "",
      dhs: "",
      fills: "",
      fuelStation: "",
      billInvoice: "",

      maintenanceShop: "",
      maintenanceBillNo: "",
    },
  });
  const expenseCategories = [
    "Fuel",
    "Machanic Expense",
    "Electriction exercise",
    "Spare parts Expense",
    "Office Expense",
    "Office rent",
    "Car petrol",
    "Staff salary",
    "Trade licence renewal",
    "DP world payment",
    "Petty cash",
    "Company road permit fee",
    "Other Expense",
  ];
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
    if (!category) return "bg-gray-100 text-gray-800";
    switch (category.trim().toLowerCase()) {
      case "fuel":
        return "bg-blue-100 text-blue-800";
      case "machanic expense":
        return "bg-orange-100 text-orange-800";
      case "electriction exercise":
        return "bg-yellow-100 text-yellow-800";
      case "spare parts expense":
        return "bg-cyan-100 text-cyan-800"; // You may need to define brown in your Tailwind config
      case "office expense":
        return "bg-purple-100 text-purple-800";
      case "office rent":
        return "bg-pink-100 text-pink-800";
      case "car petrol":
        return "bg-indigo-100 text-indigo-800";
      case "staff salary":
        return "bg-green-100 text-green-800";
      case "trade licence renewal":
        return "bg-teal-100 text-teal-800";
      case "dp world payment":
        return "bg-red-100 text-red-800";
      case "petty cash":
        return "bg-cyan-100 text-cyan-800";
      case "company road permit fee":
        return "bg-lime-100 text-lime-800";
      case "other expense":
        return "bg-gray-200 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const categoryIcons = {
    Fuel: <FaGasPump className="mr-2" />,
    "Machanic Expense": <FaTools className="mr-2" />,
    "Electriction exercise": <FaBolt className="mr-2" />,
    "Spare parts Expense": <FaCogs className="mr-2" />,
    "Office Expense": <FaBuilding className="mr-2" />,
    "Office rent": <FaHome className="mr-2" />,
    "Car petrol": <FaCar className="mr-2" />,
    "Staff salary": <FaUserTie className="mr-2" />,
    "Trade licence renewal": <FaIdBadge className="mr-2" />,
    "DP world payment": <FaGlobe className="mr-2" />,
    "Petty cash": <FaMoneyBill className="mr-2" />,
    "Company road permit fee": <FaRoad className="mr-2" />,
    "Other Expense": <FaEllipsisH className="mr-2" />,
  };

  // Handle Add Expense Form Submission
  const onSubmitExpense = async (data) => {
    try {
      console.log(data);

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

    setEditValue("quantity", expense.quantity || "");
    setEditValue("dhs", expense.dhs || "");
    setEditValue("fills", expense.fills || "");
    setEditValue("fuelStation", expense.fuelStation || "");
    setEditValue("billInvoice", expense.billInvoice || "");

    setEditValue("maintenanceShop", expense.maintenanceShop || "");
    setEditValue("maintenanceBillNo", expense.maintenanceBillNo || "");

    setIsEditExpenseModalOpen(true);
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

  const [fuelStations, setFuelStations] = useState([]);

  const getFuelStations = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewfuelstation");
      if (response.data.success) {
        setFuelStations(response.data.fuelStationsData || []);
      }
    } catch (error) {
      console.error("Error fetching fuel stations:", error);
    }
  }, []);

  const [drivers, setDrivers] = useState([]);

  const viewdrivers = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/viewdriver");

      if (responce.data.success) {
        setDrivers(responce.data.DriverData);
      } else {
        toast.error("error in getting data", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("error in getting custoemrs data", error);
    }
  }, []);

  useEffect(() => {
    viewExpences();
    gettotals();
    getVechilesData();
    viewdrivers();
    getMechanicsData();
    getFuelStations();
  }, []);

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

                  <div className="relative mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className={`bg-gradient-to-r ${gradientClass} h-4 rounded-full transition-all duration-1000 ease-out shadow-sm relative overflow-hidden`}
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                      </div>
                    </div>

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

        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>📊 Data updated in real-time</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  const GALLON_TO_LITER = 3.78541;

  const gallonsToLiters = (gallons) => {
    return gallons
      ? (parseFloat(gallons) * GALLON_TO_LITER).toFixed(2)
      : "0.00";
  };

  const litersToGallons = (liters) => {
    return liters ? (parseFloat(liters) / GALLON_TO_LITER).toFixed(2) : "0.00";
  };

  const filteredExpenses = (sampleExpenses || []).filter((expense) => {
    if (!searchTerm.trim() && (activeTab === "all" || activeTab === "vehicle"))
      return true;

    const searchLower = searchTerm.toLowerCase();
    const description = expense.description?.toLowerCase() || "";
    const vehicleNumber =
      expense["vehicleDetails.plateNumber"]?.toLowerCase() || "";

    // If a category tab is active, filter by category
    if (expenseCategories.includes(activeTab)) {
      if (expense.category?.toLowerCase() !== activeTab.toLowerCase())
        return false;
    }

    // Filter by search term
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
          getMechanicsData(),
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

  const [showMoreTabs, setShowMoreTabs] = useState(false);
  // For modal overlay
  const [showMoreModal, setShowMoreModal] = useState(false);

  // Remove dropdown click-outside logic, use modal instead

const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex items-center ${color}`}>
      <div className="mr-4 p-3 rounded-full bg-opacity-20 bg-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );

  const ExpenseCategoryTag = ({ category }) => {
    const icon = categoryIcons[category] || <FaEllipsisH className="mr-1" />;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
          category
        )}`}
      >
        {icon}
        {category}
      </span>
    );
  };

  const EnhancedSearchInput = () => (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search expenses by vehicle, description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
      />
      {searchTerm && (
        <div className="absolute right-3 inset-y-0 flex items-center">
          <button
            onClick={() => setSearchTerm("")}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );

  const EnhancedTabButton = ({ tab, currentTab, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
        currentTab === tab
          ? "bg-black text-white shadow-md"
          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {tab}
    </button>
  );

  // ... (keep all your existing functions like getCategoryColor, categoryIcons, etc.)

  return (
    <>
      {showExpenseDetail && (
        <ViewExpenseDetail
          expense={expencedetail}
          onClose={() => setShowExpenseDetail(false)}
        />
      )}
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex min-h-screen bg-gray-50">
          <Sidebar
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
          />

          <div className="flex-1 lg:ml-16 transition-all duration-300">
            {/* Enhanced Mobile Header */}
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <span className="text-xl">☰</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  Expense Tracker
                </h1>
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="bg-black text-white px-3 py-1 text-xs rounded-lg shadow"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Enhanced Desktop Header */}
            <div className="hidden lg:block border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Expense Management
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Track, manage and analyze business expenses
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsAddExpenseModalOpen(true)}
                      className="bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg shadow-md flex items-center"
                    >
                      <span className="mr-2">+</span> Add Expense
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 lg:p-8">
              {/* Enhanced Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Expenses"
                  value={`AED ${totalExpence}`}
                  icon={<FaMoneyBill className="text-red-500" />}
                  color="border-l-4 border-red-500"
                />
                {/* <StatCard
                  title="Current Balance"
                  value={`AED ${currentbalance}`}
                  icon={<FaMoneyBill className="text-green-500" />}
                  color="border-l-4 border-green-500"
                /> */}
                <StatCard
                  title="Vehicles Tracked"
                  value={Vehicles.length}
                  icon={<FaCar className="text-blue-500" />}
                  color="border-l-4 border-blue-500"
                />
                <StatCard
                  title="Active Categories"
                  value={expenseCategories.length}
                  icon={<FaFilter className="text-purple-500" />}
                  color="border-l-4 border-purple-500"
                />
              </div>

              {/* Enhanced Search and Filter Section */}
              <EnhancedSearchInput />

              {/* Enhanced Tabs Section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <EnhancedTabButton
                    tab="All"
                    currentTab={activeTab}
                    onClick={() => setActiveTab("all")}
                  />
                  <EnhancedTabButton
                    tab="Vehicle"
                    currentTab={activeTab}
                    onClick={() => setActiveTab("vehicle")}
                    icon="🚗"
                  />
                  {expenseCategories.slice(0, 3).map((cat) => (
                    <EnhancedTabButton
                      key={cat}
                      tab={cat}
                      currentTab={activeTab}
                      onClick={() => setActiveTab(cat)}
                      icon={categoryIcons[cat]}
                    />
                  ))}
                  <EnhancedTabButton
                    tab="More"
                    currentTab={expenseCategories.slice(3).includes(activeTab) ? activeTab : "More"}
                    onClick={() => setShowMoreModal(true)}
                    icon={<FaEllipsisH />}
                  />
                </div>
              {/* Modal for More Tabs */}
              {showMoreModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-xs mx-4 p-6 relative animate-fadein">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                      onClick={() => setShowMoreModal(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">Select Category</h3>
                    <div className="max-h-72 overflow-y-auto flex flex-col gap-2">
                      {expenseCategories.slice(3).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveTab(cat);
                            setShowMoreModal(false);
                          }}
                          className={`flex items-center w-full text-left px-4 py-2 rounded-lg text-sm transition-colors duration-150 border border-gray-100 ${
                            activeTab === cat
                              ? "bg-gray-200 text-black font-semibold"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {categoryIcons[cat]}
                          <span className="ml-2">{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
                {/* <div className="hidden md:flex items-center gap-2">
                  <button className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-100">
                    <FaSortAmountDown className="mr-1" />
                    Sort
                  </button>
                  <button className="flex items-center text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-100">
                    <FaFilter className="mr-1" />
                    Filter
                  </button>
                </div> */}
              </div>

              {/* Main Content Area */}
              {activeTab === "vehicle" ? (
                <VehicleExpenseChart />
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                  {/* Enhanced Desktop Table */}
                  <div className="hidden lg:block">
                    <div className="bg-gray-50 border-b border-gray-200">
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        <div className="col-span-3">Description</div>
                        <div className="col-span-2">Category</div>
                        <div className="col-span-1 text-right">Amount</div>
                        <div className="col-span-2">Vehicle</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="grid grid-cols-12 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors"
                          >
                            <div className="col-span-3 font-medium text-gray-900 truncate">
                              {expense.description}
                            </div>
                            <div className="col-span-2">
                              <ExpenseCategoryTag category={expense.category} />
                            </div>
                            <div className="col-span-1 text-right font-semibold text-red-600">
                              AED {expense.amount.toFixed(2)}
                            </div>
                            <div className="col-span-2 text-gray-600 truncate">
                              {expense["vehicleDetails.plateNumber"] || "N/A"}
                            </div>
                            <div className="col-span-2 text-gray-500">
                              {new Date(expense.date).toLocaleDateString()}
                            </div>
                            <div className="col-span-2 flex justify-end space-x-2">
                              <button
                                onClick={() => handleExpencedetail(expense)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-100"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleEditExpense(expense)}
                                className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded-lg bg-green-50 hover:bg-green-100"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-6 py-12 text-center col-span-12">
                          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-gray-400 text-3xl" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No expenses found
                          </h3>
                          <p className="text-gray-500">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Mobile List */}
                  <div className="lg:hidden space-y-3">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">
                                {expense.description}
                              </h3>
                              <div className="mt-1">
                                <ExpenseCategoryTag category={expense.category} />
                              </div>
                            </div>
                            <div className="ml-3 text-right">
                              <div className="font-bold text-red-600">
                                AED {expense.amount.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(expense.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">
                              {expense["vehicleDetails.plateNumber"] || "N/A"}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleExpencedetail(expense)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleEditExpense(expense)}
                                className="text-sm font-medium text-green-600 hover:text-green-800 px-2 py-1 rounded"
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FaSearch className="text-gray-400 text-xl" />
                        </div>
                        <h3 className="text-md font-medium text-gray-900 mb-1">
                          No matching expenses
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Adjust your search or add a new expense
                        </p>
                        <button
                          onClick={() => setIsAddExpenseModalOpen(true)}
                          className="mt-4 bg-black text-white px-4 py-2 text-sm rounded-lg shadow"
                        >
                          Add Expense
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keep your modal components as they were */}
          {isAddExpenseModalOpen && (
            <AddExpenseModal
              isOpen={isAddExpenseModalOpen}
              onClose={() => setIsAddExpenseModalOpen(false)}
              onSubmit={onSubmitExpense}
              handleSubmitExpense={handleSubmitExpense}
              registerExpense={registerExpense}
              expenseErrors={expenseErrors}
              Vehicles={Vehicles}
              mechanics={mechanics}
              selectedCategory={selectedCategory}
              watchExpense={watchExpense}
              gallonsToLiters={gallonsToLiters}
              fuelStations={fuelStations}
              drivers={drivers}
            />
          )}

          {isEditExpenseModalOpen && editingExpense && (
            <EditExpenseModal
              isOpen={isEditExpenseModalOpen}
              editingExpense={editingExpense}
              onClose={() => {
                setIsEditExpenseModalOpen(false);
                setEditingExpense(null);
                resetEditExpense();
              }}
              onSubmitEditExpense={onSubmitEditExpense}
              handleSubmitEditExpense={handleSubmitEditExpense}
              registerEditExpense={registerEditExpense}
              editExpenseErrors={editExpenseErrors}
              Vehicles={Vehicles}
              mechanics={mechanics}
              selectedEditCategory={selectedEditCategory}
              watchEditExpense={watchEditExpense}
              gallonsToLiters={gallonsToLiters}
              fuelStations={fuelStations}
              drivers={drivers}
            />
          )}

          {showExpenseDetail && expencedetail && (
            <ViewExpenseDetail
              expense={expencedetail}
              onClose={() => setShowExpenseDetail(false)}
              onEdit={handleEditExpense}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Expence;

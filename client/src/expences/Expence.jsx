import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsAddExpenseModalOpen(true)}
                    className="bg-black text-white px-2 py-1 text-xs rounded"
                  >
                    Expense
                  </button>
                </div>
              </div>
            </div>

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
                      onClick={() => setIsAddExpenseModalOpen(true)}
                      className="bg-black text-white px-4 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                    >
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 lg:p-8">
              <div className="mb-6 lg:mb-8">
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

              {activeTab === "vehicle" ? (
                <VehicleExpenseChart />
              ) : (
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
              fuelStations={fuelStations} // <-- Add this prop
              drivers={drivers}
            />
          )}

          {/* Edit Expense Modal - Similar conditional structure */}
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
              drivers={drivers} // <-- Add this line
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

import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Expence = () => {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddAmountModalOpen, setIsAddAmountModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showExpenseDetail, setShowExpenseDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [Vehicles, SetVehicles] = useState([]);

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

  // Sample data for UI display
  const sampleExpenses = [
    {
      id: 1,
      description: "Fuel for Vehicle ABC-123",
      amount: 250.0,
      category: "Fuel",
      vehiclePlateNumber: "ABC-123",
      date: "2025-01-15",
      type: "vehicle",
    },
    {
      id: 2,
      description: "Office Rent",
      amount: 2500.0,
      category: "Fixed Costs",
      vehiclePlateNumber: null,
      date: "2025-01-15",
      type: "general",
    },
    {
      id: 3,
      description: "Vehicle Maintenance - XYZ-789",
      amount: 800.0,
      category: "Maintenance",
      vehiclePlateNumber: "XYZ-789",
      date: "2025-01-14",
      type: "vehicle",
    },
    {
      id: 4,
      description: "Vehicle Maintenance - XYZ-789",
      amount: 800.0,
      category: "Maintenance",
      vehiclePlateNumber: "cdcd-789",
      date: "2025-01-14",
      type: "vehicle",
    },
  ];

  const sampleVehicles = [
    {
      id: 1,
      plateNumber: "ABC-123",
      make: "Toyota",
      model: "Hiace",
      totalAmount: 400.0,
      expenseCount: 2,
    },
    {
      id: 2,
      plateNumber: "XYZ-789",
      make: "Ford",
      model: "Transit",
      totalAmount: 1100.0,
      expenseCount: 2,
    },
    {
      id: 3,
      plateNumber: "DEF-456",
      make: "Mercedes",
      model: "Sprinter",
      totalAmount: 450.0,
      expenseCount: 1,
    },
    {
      id: 4,
      plateNumber: "D-456",
      make: "Mercedes",
      model: "Sprinter",
      totalAmount: 450.0,
      expenseCount: 1,
    },
  ];

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

  const getVechilesData = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/viewvehicle");
      console.log(responce.data);
      SetVehicles(responce.data.VehicleData);
      console.log(Vehicles);
    } catch (error) {
      console.log("error in getting vehicle data", error);
    }
  }, []);

  useEffect(() => {
    getVechilesData();
  }, []);

  // Handle Add Expense Form Submission
  const onSubmitExpense = async (data) => {
    try {
      console.log("Expense Data:", data);

      const responce=await api.post("/api/user/addexpence",data)
      console.log(responce.data);
      
 
      toast.success("Expense added successfully!", { duration: 2000 });
      resetExpense();
      setIsAddExpenseModalOpen(false);
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
      // const response = await api.post("/api/user/addamount", {
      //   amount: parseFloat(data.amount),
      //   description: data.description || "Quick Amount Addition",
      //   date: data.date
      // });

      toast.success("Amount added successfully!", { duration: 2000 });
      resetAmount();
      setIsAddAmountModalOpen(false);
    } catch (error) {
      console.error("Error adding amount:", error);
      toast.error("Failed to add amount. Please try again.", {
        duration: 3000,
      });
    }
  };

  // Vehicle Expense Chart Component
  const VehicleExpenseChart = () => {
    const maxAmount = Math.max(...sampleVehicles.map((v) => v.totalAmount));

    return (
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">
          Vehicle Expenses Comparison
        </h3>

        <div className="space-y-6">
          {sampleVehicles.map((vehicleData, index) => {
            const percentage =
              maxAmount > 0 ? (vehicleData.totalAmount / maxAmount) * 100 : 0;
            const barColors = [
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-500",
              "bg-purple-500",
              "bg-red-500",
            ];
            const barColor = barColors[index % barColors.length];

            return (
              <div key={vehicleData.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${barColor} rounded`}></div>
                    <span className="font-medium text-black">
                      {vehicleData.plateNumber}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({vehicleData.make} {vehicleData.model})
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">
                      AED {vehicleData.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {vehicleData.expenseCount} expense
                      {vehicleData.expenseCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${barColor} h-3 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% of highest expense
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div
        className={`flex-1 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        } transition-all duration-300`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Expense Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Track and manage your business expenses
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddAmountModalOpen(true)}
                  className="bg-gray-800 text-white px-6 py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Add Amount
                </button>
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search and Tabs */}
          <div className="mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search expenses by description, category, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "all"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                All Expenses
              </button>
              <button
                onClick={() => setActiveTab("vehicle")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "vehicle"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                View by Vehicle
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                Expense History
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Expenses</div>
              <div className="text-2xl font-bold text-red-600 mt-2">
                AED 3,550.00
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Vehicle Expenses</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                AED 1,050.00
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">General Expenses</div>
              <div className="text-2xl font-bold text-purple-600 mt-2">
                AED 2,500.00
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-2xl font-bold text-black mt-2">3</div>
            </div>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === "vehicle" ? (
            /* Vehicle Expense Chart */
            <VehicleExpenseChart />
          ) : (
            /* Expenses Table for All and History tabs */
            <div className="bg-white border border-gray-200">
              {/* Table Header */}
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

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {sampleExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setShowExpenseDetail(true)}
                  >
                    <div className="font-medium text-black">
                      {expense.description}
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="font-medium text-red-600">
                      AED {expense.amount.toFixed(2)}
                    </div>
                    <div className="text-gray-600">
                      {expense.vehiclePlateNumber || "N/A"}
                    </div>
                    <div className="text-gray-600">{expense.date}</div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          expense.type === "vehicle"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {expense.type}
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Expense</h3>
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
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    {...registerExpense("description", {
                      required: "Description is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    Vehicle (Optional)
                  </label>
                  <select
                    {...registerExpense("vehicleId")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  >
                    <option value="">Select Vehicle</option>
                    {Vehicles.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.plateNumber}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  {expenseErrors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {expenseErrors.date.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Remarks
                  </label>
                  <textarea
                    {...registerExpense("remarks")}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm resize-none"
                    placeholder="Additional notes or remarks"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Amount Modal */}
      {isAddAmountModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add Amount</h3>
              <button
                onClick={() => setIsAddAmountModalOpen(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitAmount(onSubmitAmount)} className="p-6">
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  {amountErrors.date && (
                    <p className="text-red-500 text-xs mt-1">
                      {amountErrors.date.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddAmountModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
                >
                  Add Amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Detail Modal */}
      {showExpenseDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Expense Details</h3>
              <button
                onClick={() => setShowExpenseDetail(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Expense Information */}
                <div>
                  <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Expense Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">Fuel for Vehicle ABC-123</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-red-600">AED 250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Fuel
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">2025-01-15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        vehicle
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
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plate Number:</span>
                      <span className="font-medium">ABC-123</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                  Remarks
                </h4>
                <p className="text-gray-700 bg-gray-50 p-4 rounded">
                  Regular fuel refill for vehicle
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowExpenseDetail(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expence;
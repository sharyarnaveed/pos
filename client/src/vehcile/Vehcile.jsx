import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Vehcile = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showVehicleDetail, setShowVehicleDetail] = useState(false);
  const [showEditVehicle, setShowEditVehicle] = useState(false); // Add this line
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, SetLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [isUpdatingVehicle, setIsUpdatingVehicle] = useState(false); // Add this line
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      plateNumber: "",
      type: "Truck",
      fuelType: "Diesel",
    },
  });

  // Add edit form
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm({
    defaultValues: {
      plateNumber: "",
      type: "Truck",
      fuelType: "Diesel",
      status: "Active",
    },
  });

  const { register: registerSearch, watch } = useForm({
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTerm = watch("searchTerm");

  const filteredVehicles = useMemo(() =>
    vehicles.filter((vehicle) =>
      String(vehicle.plateNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddVehicle = async (data) => {
    if (isAddingVehicle) return;
    
    setIsAddingVehicle(true);
    try {
      const response = await api.post("/api/user/addvehicle", data);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 3000,
        });
        reset();
        await getvehicledata();
        setShowAddVehicle(false);
      } else {
        toast.error(response.data.message, {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("ERROR ADDING VEHICLE", {
        duration: 3000,
      });
    } finally {
      setIsAddingVehicle(false);
    }
  };

  // Add edit vehicle handler
  const handleEditVehicle = async (data) => {
    if (isUpdatingVehicle) return;
    
    setIsUpdatingVehicle(true);
    try {
      const response = await api.put(`/api/user/updatevehicle/${selectedVehicle.id}`, data);
    
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
        });
        await getvehicledata();
        setShowEditVehicle(false);
        setShowVehicleDetail(false);
        resetEdit();
      } else {
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log("error in updating vehicle", error);
      toast.error("Error updating vehicle", {
        duration: 3000,
      });
    } finally {
      setIsUpdatingVehicle(false);
    }
  };

  // Add function to handle edit button click
  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setValueEdit("plateNumber", vehicle.plateNumber);
    setValueEdit("type", vehicle.type);
    setValueEdit("fuelType", vehicle.fuelType);
    setValueEdit("status", vehicle.status || "Active");
    setShowEditVehicle(true);
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetail(true);
  };

  const getStatusColor = (status) => {
    const statusUpper = String(status || "").toUpperCase();
    switch (statusUpper) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVehicleIcon = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "truck":
        return "🚛";
      case "van":
        return "🚐";
      case "car":
        return "🚗";
      case "motorcycle":
        return "🏍️";
      default:
        return "🚛";
    }
  };

  const getvehicledata = async () => {
    try {
      const responce = await api.get("/api/user/viewvehicle");
      if (responce.data.success) {
        setVehicles(responce.data.VehicleData);
      }
    } catch (error) {
      console.error("Error viewing vehicle:", error);
    }
  };

  const checkAccountLogin = async () => {
    SetLoading(true);
    try {
      const responce = await api.get("/api/user/authcheck");
    
      if (responce.data.authenticated == true) {
        SetLoading(false);
        await getvehicledata();
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
                <h1 className="text-lg font-semibold text-gray-900">VEHICLES</h1>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="bg-black text-white px-3 py-1 text-sm rounded"
                >
                  ADD
                </button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-gray-200 bg-white">
              <div className="px-4 sm:px-8 py-4 md:py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-black">VEHICLES</h1>
                    <p className="text-gray-600 text-xs md:text-sm mt-1">
                      MANAGE YOUR VEHICLE FLEET
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-black text-white px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                  >
                    ADD VEHICLE
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 lg:p-8">
              {/* Search and Stats */}
              <div className="mb-6 lg:mb-8">
                {/* Search Bar */}
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    placeholder="Search vehicles by plate number..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm lg:text-base"
                    {...registerSearch("searchTerm")}
                  />
                  {searchTerm && (
                    <p className="text-xs text-gray-500 mt-2">
                      SHOWING RESULTS FOR: "{searchTerm.toUpperCase()}" ({filteredVehicles.length} FOUND)
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">TOTAL VEHICLES</div>
                    <div className="text-lg lg:text-2xl font-bold text-black mt-2">
                      {vehicles.length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">ACTIVE VEHICLES</div>
                    <div className="text-lg lg:text-2xl font-bold text-green-600 mt-2">
                      {vehicles.filter(v => String(v.status || "").toUpperCase() === "ACTIVE").length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">IN MAINTENANCE</div>
                    <div className="text-lg lg:text-2xl font-bold text-yellow-600 mt-2">
                      {vehicles.filter(v => String(v.status || "").toUpperCase() === "MAINTENANCE").length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">TRUCKS</div>
                    <div className="text-lg lg:text-2xl font-bold text-blue-600 mt-2">
                      {vehicles.filter(v => String(v.type || "").toUpperCase() === "TRUCK").length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleVehicleClick(vehicle)}
                    className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Vehicle Icon & Status */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl lg:text-3xl">
                          {getVehicleIcon(vehicle.type)}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            vehicle.status || "Active"
                          )}`}
                        >
                          {String(vehicle.status || "ACTIVE").toUpperCase()}
                        </span>
                      </div>

                      {/* Vehicle Info */}
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black">
                          {String(vehicle.plateNumber || "").toUpperCase()}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                          {String(vehicle.type || "").toUpperCase()} • {String(vehicle.fuelType || "").toUpperCase()}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-2 text-xs lg:text-sm">
                          <div>
                            <span className="text-gray-500">TYPE:</span>
                            <p className="font-medium text-black">{String(vehicle.type || "").toUpperCase()}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">FUEL:</span>
                            <p className="font-medium text-black">{String(vehicle.fuelType || "").toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty States */}
              {filteredVehicles.length === 0 && vehicles.length > 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl lg:text-6xl mb-4">🔍</div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                    NO VEHICLES FOUND
                  </h3>
                  <p className="text-gray-500 text-sm">
                    NO VEHICLES MATCH "{searchTerm.toUpperCase()}"
                  </p>
                </div>
              )}

              {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl lg:text-6xl mb-4">🚛</div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                    No vehicles added yet
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Start by adding your first vehicle to the fleet
                  </p>
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add Vehicle Modal - Enhanced Responsive */}
          {showAddVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form
                onSubmit={handleSubmit(handleAddVehicle)}
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Add New Vehicle
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAddVehicle(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Plate Number *
                      </label>
                      <input
                        type="text"
                        {...register("plateNumber", {
                          required: "Plate number is required",
                          pattern: {
                            value: /^[A-Za-z0-9]{2,15}$/,
                            message: "Please enter a valid plate number",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="e.g., ABC-1234"
                      />
                      {errors.plateNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.plateNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        {...register("type", { required: "Vehicle type is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Truck">Truck</option>
                        <option value="Van">Van</option>
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.type.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Fuel Type *
                      </label>
                      <select
                        {...register("fuelType", { required: "Fuel type is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      {errors.fuelType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fuelType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddVehicle(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingVehicle}
                      className="w-full sm:w-auto bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isAddingVehicle ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        "Add Vehicle"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Vehicle Detail Modal - Enhanced Responsive */}
          {showVehicleDetail && selectedVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Vehicle Details
                    </h2>
                    <button
                      onClick={() => setShowVehicleDetail(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Vehicle Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Vehicle Information
                        </h3>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Plate Number
                            </label>
                            <p className="text-black font-medium font-mono">
                              {String(selectedVehicle.plateNumber || "").toUpperCase()}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Vehicle Type
                            </label>
                            <p className="text-black">{String(selectedVehicle.type || "").toUpperCase()}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Fuel Type
                            </label>
                            <p className="text-black">{String(selectedVehicle.fuelType || "").toUpperCase()}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              STATUS
                            </label>
                            <span
                              className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(
                                selectedVehicle.status || "Active"
                              )}`}
                            >
                              {String(selectedVehicle.status || "ACTIVE").toUpperCase()}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              ADDED DATE
                            </label>
                            <p className="text-black">
                              {selectedVehicle.createdAt ? 
                                new Date(selectedVehicle.createdAt).toLocaleDateString() : 
                                "N/A"
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          QUICK ACTIONS
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => {
                                setShowVehicleDetail(false);
                                handleEditClick(selectedVehicle);
                              }}
                              className="w-full px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg"
                            >
                              EDIT VEHICLE DETAILS
                            </button>
                            <button
                              onClick={() => {
                                // Navigate to create order with this vehicle
                                navigate("/data");
                                setShowVehicleDetail(false);
                              }}
                              className="w-full px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors rounded-lg"
                            >
                              CREATE ORDER FOR THIS VEHICLE
                            </button>
                            <button
                              onClick={() => {
                                // Navigate to expenses with this vehicle
                                navigate("/expenses");
                                setShowVehicleDetail(false);
                              }}
                              className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              VIEW VEHICLE EXPENSES
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Stats */}
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          VEHICLE STATS
                        </h3>
                        
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowVehicleDetail(false)}
                      className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Vehicle Modal */}
          {showEditVehicle && selectedVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form
                onSubmit={handleSubmitEdit(handleEditVehicle)}
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      EDIT VEHICLE DETAILS
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditVehicle(false);
                        resetEdit();
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Plate Number *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("plateNumber", {
                          required: "Plate number is required",
                          pattern: {
                            value: /^[A-Za-z0-9\-\s]{2,15}$/,
                            message: "Please enter a valid plate number",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="e.g., ABC-1234"
                      />
                      {errorsEdit.plateNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.plateNumber.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        {...registerEdit("type", { required: "Vehicle type is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Truck">Truck</option>
                        <option value="Van">Van</option>
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                      </select>
                      {errorsEdit.type && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.type.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Fuel Type *
                      </label>
                      <select
                        {...registerEdit("fuelType", { required: "Fuel type is required" })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      {errorsEdit.fuelType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.fuelType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEditVehicle(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingVehicle}
                      className="w-full sm:w-auto bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isUpdatingVehicle ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Vehicle"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Vehcile;

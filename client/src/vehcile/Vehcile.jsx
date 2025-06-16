import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
const Vehcile = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showVehicleDetail, setShowVehicleDetail] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, SetLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
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

  const { register: registerSearch, watch } = useForm({
    defaultValues: {
      searchTerm: "",
    },
  });

  const searchTerm = watch("searchTerm");

  const filteredVehicles = useMemo(()=> vehicles.filter((vehicle) =>
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleAddVehicle = async (data) => {
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
    }
  };

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetail(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      console.log(responce.data);
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
                    <h1 className="text-2xl font-bold text-black">Vehicles</h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Manage your vehicle fleet
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Search and Stats */}
              <div className="mb-8">
                {/* Search Bar with React Hook Form */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search vehicles by plate number, make, or model..."
                    className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    {...registerSearch("searchTerm")}
                  />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="text-sm text-gray-600">Total Vehicles</div>
                    <div className="text-2xl font-bold text-black mt-2">
                      {vehicles.length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="text-sm text-gray-600">Active Vehicles</div>
                    <div className="text-2xl font-bold text-green-600 mt-2">
                      {vehicles.filter((v) => v.status === "Active").length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="text-sm text-gray-600">In Maintenance</div>
                    <div className="text-2xl font-bold text-yellow-600 mt-2">
                      {
                        vehicles.filter((v) => v.status === "Maintenance")
                          .length
                      }
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="text-sm text-gray-600">Total Distance</div>
                    <div className="text-2xl font-bold text-black mt-2">
                      60,140 km
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicles Grid - Use filteredVehicles instead of vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleVehicleClick(vehicle)}
                    className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-black">
                          {vehicle.plateNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {vehicle.year} • {vehicle.type}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Driver:</span>
                        <span className="text-black font-medium">
                          {vehicle.driverAssigned}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="text-black font-medium">
                          {vehicle.capacity}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Trips:</span>
                        <span className="text-black font-medium">
                          {vehicle.totalTrips}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Distance:</span>
                        <span className="text-black font-medium">
                          {vehicle.totalDistance}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Fuel: {vehicle.fuelType}</span>
                        <span>Color: {vehicle.color}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show message when no vehicles found */}
              {filteredVehicles.length === 0 && vehicles.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vehicles found matching your search.
                  </p>
                </div>
              )}

              {/* Show message when no vehicles at all */}
              {vehicles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No vehicles added yet.</p>
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add Your First Vehicle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add Vehicle Modal */}
          {showAddVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-black">
                    Add New Vehicle
                  </h2>
                  <button
                    onClick={() => setShowAddVehicle(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit(handleAddVehicle)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Plate Number *
                      </label>
                      <input
                        type="text"
                        {...register("plateNumber", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="e.g., ABC-1234"
                      />
                      {errors.plateNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          Plate number is required.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Vehicle Type *
                      </label>
                      <select
                        {...register("type", { required: true })}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Truck">Truck</option>
                      </select>
                      {errors.type && (
                        <p className="text-red-500 text-xs mt-1">
                          Vehicle type is required.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Fuel Type
                      </label>
                      <select
                        {...register("fuelType")}
                        className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Vehicle Detail Modal */}
          {showVehicleDetail && selectedVehicle && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-black">
                    Vehicle Details
                  </h2>
                  <button
                    onClick={() => setShowVehicleDetail(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Vehicle Information */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                        Vehicle Information
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Plate Number
                          </label>
                          <p className="text-black font-medium font-mono">
                            {selectedVehicle.plateNumber}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Make
                            </label>
                            <p className="text-black">{selectedVehicle.make}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Model
                            </label>
                            <p className="text-black">
                              {selectedVehicle.model}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Year
                            </label>
                            <p className="text-black">{selectedVehicle.year}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Type
                            </label>
                            <p className="text-black">{selectedVehicle.type}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Color
                            </label>
                            <p className="text-black">
                              {selectedVehicle.color}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Capacity
                            </label>
                            <p className="text-black">
                              {selectedVehicle.capacity}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Fuel Type
                            </label>
                            <p className="text-black">
                              {selectedVehicle.fuelType}
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Assigned Driver
                          </label>
                          <p className="text-black font-medium">
                            {selectedVehicle.driverAssigned}
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Status
                          </label>
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(
                              selectedVehicle.status
                            )}`}
                          >
                            {selectedVehicle.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Usage Statistics & Maintenance */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                        Usage Statistics
                      </h3>

                      <div className="bg-gray-50 p-4 space-y-3 mb-6">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Trips:
                          </span>
                          <span className="text-black font-medium">
                            {selectedVehicle.totalTrips}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Distance:
                          </span>
                          <span className="text-black font-medium">
                            {selectedVehicle.totalDistance}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-md font-semibold text-black mb-3">
                        Maintenance & Documents
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Last Maintenance:
                          </span>
                          <span className="text-black">
                            {selectedVehicle.lastMaintenance}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Next Maintenance:
                          </span>
                          <span className="text-black font-medium">
                            {selectedVehicle.nextMaintenance}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Registration Expiry:
                          </span>
                          <span className="text-black">
                            {selectedVehicle.registrationExpiry}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Insurance Expiry:
                          </span>
                          <span className="text-black">
                            {selectedVehicle.insuranceExpiry}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mt-6">
                        <h4 className="text-sm font-medium text-black">
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            View Trip History
                          </button>
                          <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Generate Vehicle Report
                          </button>
                          <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                            Edit Vehicle Info
                          </button>
                          <div className="pt-2 border-t border-gray-200">
                            <button className="w-full px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                              Deactivate Vehicle
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowVehicleDetail(false)}
                    className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Vehcile;

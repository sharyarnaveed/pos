import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const MechanicManagement = () => {
  const [mechanics, setMechanics] = useState([]);
  const [fuelStations, setFuelStations] = useState([]);
  const [activeTab, setActiveTab] = useState("mechanics");
  const [formData, setFormData] = useState({
    shopName: "",
    status: "Active",
    // Fuel station fields
    stationName: "",
    location: "",
    fuelTypes: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [showMechanicDetail, setShowMechanicDetail] = useState(false);
  const [showFuelStationDetail, setShowFuelStationDetail] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [selectedFuelStation, setSelectedFuelStation] = useState(null);
  const navigate = useNavigate();

  // Filter mechanics based on search term
  const filteredMechanics = mechanics.filter((mechanic) =>
    mechanic.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter fuel stations based on search term
  const filteredFuelStations = fuelStations.filter(
    (station) =>
      station.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      station.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check authentication
  const checkAccountLogin = async () => {
    setPageLoading(true);
    try {
      const response = await api.get("/api/user/authcheck");
      if (response.data.authenticated === true) {
        await fetchMechanics();
        await fetchFuelStations();
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.log("error in checking user login", error);
      navigate("/signin");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    checkAccountLogin();
  }, []);

  const fetchMechanics = async () => {
    try {
      const response = await api.get("/api/user/viewmechanic");
      if (response.data.success) {
        setMechanics(response.data.mechanicsData);
      } else {
        toast.error("Failed to fetch mechanics");
      }
    } catch (error) {
      console.error("Error fetching mechanics:", error);
      toast.error("Error fetching mechanics");
    }
  };

  const fetchFuelStations = async () => {
    try {
      const response = await api.get("/api/user/viewfuelstation");
      if (response.data.success) {
        setFuelStations(response.data.fuelStationsData);
      } else {
        toast.error("Failed to fetch fuel stations");
      }
    } catch (error) {
      console.error("Error fetching fuel stations:", error);
      toast.error("Error fetching fuel stations");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url, method;

      if (activeTab === "mechanics") {
        url = isEditing
          ? `/api/user/updatemechanic/${editingId}`
          : `/api/user/addmechanic`;
      } else {
        url = isEditing
          ? `/api/user/updatefuelstation/${editingId}`
          : `/api/user/addfuelstation`;
      }

      method = isEditing ? "put" : "post";
      const response = await api[method](url, formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setShowModal(false);
        resetForm();
        if (activeTab === "mechanics") {
          fetchMechanics();
        } else {
          fetchFuelStations();
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (activeTab === "mechanics") {
      setFormData({
        shopName: item.shopName,
        status: item.status,
        stationName: "",
        location: "",
        fuelTypes: "",
      });
    } else {
      setFormData({
        shopName: "",
        status: "Active",
        stationName: item.stationName,
        location: item.location,
        fuelTypes: item.fuelTypes,
      });
    }
    setIsEditing(true);
    setEditingId(item.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmText = activeTab === "mechanics" ? "mechanic" : "fuel station";
    if (
      window.confirm(`Are you sure you want to delete this ${confirmText}?`)
    ) {
      try {
        const url =
          activeTab === "mechanics"
            ? `/api/user/deletemechanic/${id}`
            : `/api/user/deletefuelstation/${id}`;

        const response = await api.delete(url);

        if (response.data.success) {
          toast.success(response.data.message);
          if (activeTab === "mechanics") {
            fetchMechanics();
          } else {
            fetchFuelStations();
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Error deleting data");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      shopName: "",
      status: "Active",
      stationName: "",
      location: "",
      fuelTypes: "",
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleMechanicClick = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowMechanicDetail(true);
  };

  const handleFuelStationClick = (station) => {
    setSelectedFuelStation(station);
    setShowFuelStationDetail(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  if (pageLoading) {
    return <Spinner />;
  }

  return (
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
              {activeTab === "mechanics" ? "MECHANICS" : "FUEL STATIONS"}
            </h1>
            <button
              onClick={openModal}
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
                <h1 className="text-xl md:text-2xl font-bold text-black">
                  {activeTab === "mechanics" ? "MECHANICS" : "FUEL STATIONS"}
                </h1>
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  {activeTab === "mechanics"
                    ? "MANAGE YOUR MECHANIC SHOPS"
                    : "MANAGE YOUR FUEL STATIONS"}
                </p>
              </div>
              <button
                onClick={openModal}
                className="bg-black text-white px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
              >
                {activeTab === "mechanics"
                  ? "ADD MECHANIC"
                  : "ADD FUEL STATION"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 lg:p-8">
          {/* Tab Navigation */}
          <div className="mb-6 lg:mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => switchTab("mechanics")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "mechanics"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  🔧 MECHANICS
                </button>
                <button
                  onClick={() => switchTab("fuelStations")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "fuelStations"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  ⛽ FUEL STATIONS
                </button>
              </nav>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="mb-6 lg:mb-8">
            {/* Search Bar */}
            <div className="mb-4 lg:mb-6">
              <input
                type="text"
                placeholder={
                  activeTab === "mechanics"
                    ? "Search mechanics by shop name..."
                    : "Search fuel stations by name or location..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm lg:text-base"
              />
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-2">
                  SHOWING RESULTS FOR: "{searchTerm.toUpperCase()}" (
                  {activeTab === "mechanics"
                    ? filteredMechanics.length
                    : filteredFuelStations.length}{" "}
                  FOUND)
                </p>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {activeTab === "mechanics" ? (
                <>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      TOTAL MECHANICS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-black mt-2">
                      {mechanics.length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      ACTIVE MECHANICS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-green-600 mt-2">
                      {mechanics.filter((m) => m.status === "Active").length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      INACTIVE MECHANICS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-red-600 mt-2">
                      {mechanics.filter((m) => m.status === "Inactive").length}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      TOTAL STATIONS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-black mt-2">
                      {fuelStations.length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      ACTIVE STATIONS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-green-600 mt-2">
                      {fuelStations.filter((s) => s.status === "Active").length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">
                      INACTIVE STATIONS
                    </div>
                    <div className="text-lg lg:text-2xl font-bold text-red-600 mt-2">
                      {
                        fuelStations.filter((s) => s.status === "Inactive")
                          .length
                      }
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {activeTab === "mechanics"
              ? // Mechanics Grid
                filteredMechanics.map((mechanic) => (
                  <div
                    key={mechanic.id}
                    onClick={() => handleMechanicClick(mechanic)}
                    className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Mechanic Icon & Status */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl lg:text-3xl">🔧</div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            mechanic.status
                          )}`}
                        >
                          {mechanic.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Mechanic Info */}
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black">
                          {mechanic.shopName.toUpperCase()}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                          ID: {mechanic.id}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs lg:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ADDED:</span>
                            <span className="text-black font-medium">
                              {new Date(
                                mechanic.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : // Fuel Stations Grid
                filteredFuelStations.map((station) => (
                  <div
                    key={station.id}
                    onClick={() => handleFuelStationClick(station)}
                    className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex flex-col space-y-3">
                      {/* Station Icon & Status */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl lg:text-3xl">⛽</div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            station.status
                          )}`}
                        >
                          {station.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Station Info */}
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black">
                          {station.stationName.toUpperCase()}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                          📍 {station.location}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                          ID: {station.id}
                        </p>
                      </div>

                      {/* Fuel Types */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          FUEL TYPES:
                        </p>
                        <p className="text-xs lg:text-sm font-medium text-black">
                          {station.fuelTypes}
                        </p>
                      </div>

                      {/* Quick Stats */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="text-xs lg:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ADDED:</span>
                            <span className="text-black font-medium">
                              {new Date(station.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          {/* Empty State */}
          {((activeTab === "mechanics" && filteredMechanics.length === 0) ||
            (activeTab === "fuelStations" &&
              filteredFuelStations.length === 0)) && (
            <div className="text-center py-12">
              <div className="text-4xl lg:text-6xl mb-4">
                {activeTab === "mechanics" ? "🔧" : "⛽"}
              </div>
              <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                No {activeTab === "mechanics" ? "mechanics" : "fuel stations"}{" "}
                found
              </h3>
              <p className="text-gray-500 text-sm">
                {searchTerm
                  ? `No ${
                      activeTab === "mechanics" ? "mechanics" : "fuel stations"
                    } match "${searchTerm}"`
                  : `Start by adding your first ${
                      activeTab === "mechanics" ? "mechanic" : "fuel station"
                    }`}
              </p>
              {!searchTerm && (
                <button
                  onClick={openModal}
                  className="mt-4 bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
                >
                  Add First{" "}
                  {activeTab === "mechanics" ? "Mechanic" : "Fuel Station"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-full sm:max-w-md max-h-[95vh] overflow-y-auto rounded-lg m-2"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                  {isEditing
                    ? `EDIT ${
                        activeTab === "mechanics" ? "MECHANIC" : "FUEL STATION"
                      }`
                    : `ADD NEW ${
                        activeTab === "mechanics" ? "MECHANIC" : "FUEL STATION"
                      }`}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {activeTab === "mechanics" ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Shop Name *
                      </label>
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter shop name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Station Name *
                      </label>
                      <input
                        type="text"
                        name="stationName"
                        value={formData.stationName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter station name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter location"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Fuel Types *
                      </label>
                      <input
                        type="text"
                        name="fuelTypes"
                        value={formData.fuelTypes}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="e.g., Diesel, Petrol, Gas"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : isEditing ? (
                    `Update ${
                      activeTab === "mechanics" ? "Mechanic" : "Station"
                    }`
                  ) : (
                    `Add ${activeTab === "mechanics" ? "Mechanic" : "Station"}`
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Mechanic Detail Modal */}
      {showMechanicDetail && selectedMechanic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                  MECHANIC DETAILS
                </h2>
                <button
                  onClick={() => setShowMechanicDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Mechanic Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        Shop Name
                      </label>
                      <p className="text-black font-medium break-words uppercase">
                        {selectedMechanic.shopName}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        Status
                      </label>
                      <span
                        className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(
                          selectedMechanic.status
                        )}`}
                      >
                        {selectedMechanic.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        ID
                      </label>
                      <p className="text-black">{selectedMechanic.id}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        Added Date
                      </label>
                      <p className="text-black">
                        {new Date(
                          selectedMechanic.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          setShowMechanicDetail(false);
                          handleEdit(selectedMechanic);
                        }}
                        className="w-full px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg"
                      >
                        EDIT MECHANIC DETAILS
                      </button>
                      <button
                        onClick={() => {
                          setShowMechanicDetail(false);
                          handleDelete(selectedMechanic.id);
                        }}
                        className="w-full px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg"
                      >
                        DELETE MECHANIC
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowMechanicDetail(false)}
                  className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fuel Station Detail Modal */}
      {showFuelStationDetail && selectedFuelStation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl font-bold text-black">
                  FUEL STATION DETAILS
                </h2>
                <button
                  onClick={() => setShowFuelStationDetail(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Station Information
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        Station Name
                      </label>
                      <p className="text-black font-medium break-words uppercase">
                        {selectedFuelStation.stationName}
                      </p>
                    </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <span
                    className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusColor(
                      selectedFuelStation.status
                    )}`}
                  >
                    {selectedFuelStation.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <label className="text-sm font-medium text-gray-600">
                    Location
                  </label>
                  <p className="text-black">{selectedFuelStation.location}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <label className="text-sm font-medium text-gray-600">
                    Fuel Types
                  </label>
                  <p className="text-black">{selectedFuelStation.fuelTypes}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <label className="text-sm font-medium text-gray-600">
                    ID
                  </label>
                  <p className="text-black">{selectedFuelStation.id}</p>
                </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <label className="text-sm font-medium text-gray-600">
                        Added Date
                      </label>
                      <p className="text-black">
                        {new Date(
                          selectedFuelStation.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Quick Actions
                  </h3>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => {
                          setShowFuelStationDetail(false);
                          handleEdit(selectedFuelStation);
                        }}
                        className="w-full px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg"
                      >
                        EDIT STATION DETAILS
                      </button>
                      <button
                        onClick={() => {
                          setShowFuelStationDetail(false);
                          handleDelete(selectedFuelStation.id);
                        }}
                        className="w-full px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 transition-colors rounded-lg"
                      >
                        DELETE STATION
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowFuelStationDetail(false)}
                  className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   
  );
};

export default MechanicManagement;

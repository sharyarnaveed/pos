import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import DriverReport from "../generatestuff/DriverReport";

const Driver = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [showEditDriver, setShowEditDriver] = useState(false); // Add this line
  const [showDriverReport, setShowDriverReport] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, SetLoading] = useState(false);
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Add this line
  const navigate = useNavigate();

  const [drivers, setDrivers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      drivername: "",
      driverphoneno: ""
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
    mode: "onBlur",
    defaultValues: {
      drivername: "",
      driverphoneno: ""
    },
  });

  const handleAddDriver = async (data) => {
    if (isAddingDriver) return;
    
    setIsAddingDriver(true);
    console.log(data);
    try {
      const responce = await api.post("/api/user/adddriver", data)
      console.log(responce.data);
      if (responce.data.success) {
        toast.success(responce.data.message, {
          duration: 2000
        })
        reset()
        setShowAddDriver(false)
        await viewdrivers();
      } else {
        toast.error(responce.data.message, {
          duration: 2000
        })
      }
    } catch (error) {
      console.log("error in adding driver", error);
      toast.error("error in adding driver", {
        duration: 3000
      })
    } finally {
      setIsAddingDriver(false);
    }
  };

  // Add edit driver handler
  const handleEditDriver = async (data) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const response = await api.put(`/api/user/updatedriver/${selectedDriver.id}`, data);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
        });
        await viewdrivers();
        setShowEditDriver(false);
        setShowDriverDetail(false);
        resetEdit();
      } else {
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log("error in updating driver", error);
      toast.error("Error updating driver", {
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Add function to handle edit button click
  const handleEditClick = (driver) => {
    setSelectedDriver(driver);
    setValueEdit("drivername", driver.drivername);
    setValueEdit("driverphoneno", driver.driverphoneno);
    setShowEditDriver(true);
  };

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetail(true);
  };

  const [customerloading, setcustoemrloading] = useState(false);

  const viewdrivers = useCallback(async () => {
    setcustoemrloading(true);
    try {
      const responce = await api.get("/api/user/viewdriver");
      console.log(responce.data);
      if (responce.data.success) {
        setcustoemrloading(false);
        setDrivers(responce.data.DriverData);
      } else {
        toast.error("error in getting data", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("error in getting custoemrs data", error);
    } finally {
      setcustoemrloading(false);
    }
  }, []);

  const filterData = useMemo(() => {
    if (!searchTerm) return drivers

    return drivers.filter(item =>
      item.drivername.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [drivers, searchTerm])

  const checkAccountLogin = async () => {
    SetLoading(true);
    try {
      const responce = await api.get("/api/user/authcheck");
      console.log(responce.data);
      if (responce.data.authenticated == true) {
        SetLoading(false);
        await viewdrivers();
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
                <h1 className="text-lg font-semibold text-gray-900">Drivers</h1>
                <button
                  onClick={() => setShowAddDriver(true)}
                  className="bg-black text-white px-3 py-1 text-sm rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block border-b border-gray-200 bg-white">
              <div className="px-4 sm:px-8 py-4 md:py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-black">Drivers</h1>
                    <p className="text-gray-600 text-xs md:text-sm mt-1">
                      Manage your driver database
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDriver(true)}
                    className="bg-black text-white px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                  >
                    Add Driver
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 lg:p-8">
              {/* Search and Stats Section */}
              <div className="mb-6 lg:mb-8">
                {/* Search Bar */}
                <div className="mb-4 lg:mb-6">
                  <input
                    type="text"
                    placeholder="Search drivers by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm lg:text-base"
                  />
                  {searchTerm && (
                    <p className="text-xs text-gray-500 mt-2">
                      Showing results for: "{searchTerm}" ({filterData.length} found)
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                {customerloading ? (
                  <Spinner />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                    <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                      <div className="text-xs lg:text-sm text-gray-600">Total Drivers</div>
                      <div className="text-lg lg:text-2xl font-bold text-black mt-2">
                        {drivers.length}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                {filterData.map((driver) => (
                  <div
                    key={driver.id}
                    onClick={() => handleDriverClick(driver)}
                    className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg lg:text-xl font-bold text-gray-600">
                            {driver.drivername.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black truncate uppercase">
                          {driver.drivername}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">
                          {driver.driverphoneno}
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs lg:text-sm">
                          <span className="text-gray-500">Status</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            AVAILABLE
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filterData.length === 0 && !customerloading && (
                <div className="text-center py-12">
                  <div className="text-4xl lg:text-6xl mb-4">👨‍💼</div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                    No drivers found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? `No drivers match "${searchTerm.toUpperCase()}"` : "Start by adding your first driver"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowAddDriver(true)}
                      className="mt-4 bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Add First Driver
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Driver Modal - Enhanced Responsive */}
          {showAddDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form 
                onSubmit={handleSubmit(handleAddDriver)} 
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">Add New Driver</h2>
                    <button
                      type="button"
                      onClick={() => setShowAddDriver(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-black mb-2">
                        Driver Name *
                      </label>
                      <input
                        type="text"
                        {...register("drivername", {
                          required: "Driver Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s]{2,100}$/,
                            message: "Driver name should be 2-100 characters with letters",
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter driver's full name"
                      />
                      {errors.drivername && (
                        <p className="text-red-500 text-xs mt-1">{errors.drivername.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone No *
                      </label>
                      <input
                        type="tel"
                        {...register("driverphoneno", {
                          required: "Phone Number required",
                          pattern: {
                            value: /^[\+]?[0-9][\d]{0,15}$/,
                            message: "Please enter a valid phone number",
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter Phone No"
                      />
                      {errors.driverphoneno && (
                        <p className="text-red-500 text-xs mt-1">{errors.driverphoneno.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={() => setShowAddDriver(false)}
                      className="w-full sm:flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingDriver}
                      className="w-full sm:flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isAddingDriver ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        "Add Driver"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Driver Detail Modal - Enhanced Responsive */}
          {showDriverDetail && selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">Driver Details</h2>
                    <button
                      onClick={() => setShowDriverDetail(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Personal Information
                        </h3>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Full Name
                            </label>
                            <p className="text-black font-medium break-words uppercase">
                              {selectedDriver.drivername}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Phone No
                            </label>
                            <p className="text-black break-words">{selectedDriver.driverphoneno}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Status
                            </label>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs w-fit">
                              AVAILABLE
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Information & Statistics */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Quick Actions
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => {
                                setShowDriverDetail(false);
                                handleEditClick(selectedDriver);
                              }}
                              className="w-full px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg"
                            >
                              Edit Driver Details
                            </button>
                            <button
                              onClick={() => setShowDriverReport(true)}
                              className="w-full px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors rounded-lg"
                            >
                              Generate Driver Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowDriverDetail(false)}
                      className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Driver Modal */}
          {showEditDriver && selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form
                onSubmit={handleSubmitEdit(handleEditDriver)}
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 sm:py-6 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Edit Driver Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDriver(false);
                        resetEdit();
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-black mb-2">
                        Driver Name *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("drivername", {
                          required: "Driver Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s]{2,100}$/,
                            message: "Driver name should be 2-100 characters with letters",
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter driver's full name"
                      />
                      {errorsEdit.drivername && (
                        <p className="text-red-500 text-xs mt-1">{errorsEdit.drivername.message}</p>
                      )}
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone No *
                      </label>
                      <input
                        type="tel"
                        {...registerEdit("driverphoneno", {
                          required: "Phone Number required",
                          pattern: {
                            value: /^[\+]?[0-9][\d]{0,15}$/,
                            message: "Please enter a valid phone number",
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter Phone No"
                      />
                      {errorsEdit.driverphoneno && (
                        <p className="text-red-500 text-xs mt-1">{errorsEdit.driverphoneno.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditDriver(false);
                        resetEdit();
                      }}
                      className="w-full sm:flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:flex-1 bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Driver"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Driver Report Modal - Enhanced Responsive */}
          {showDriverReport && selectedDriver && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full h-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={() => setShowDriverReport(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <DriverReport driverId={selectedDriver.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Driver;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
import DriverReport from "../generatestuff/DriverReport"; // Add this import

const Driver = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showDriverDetail, setShowDriverDetail] = useState(false);
  const [showDriverReport, setShowDriverReport] = useState(false); // Add this state
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, SetLoading] = useState(false);
  const [isAddingDriver, setIsAddingDriver] = useState(false); // Add this state
  const navigate = useNavigate();

  // Sample drivers data
  const [drivers, setDrivers] = useState([
  ]);

  // New driver form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
 drivername:"",
 driverphoneno:""
    },
  });

  const handleAddDriver = async(data) => {
    if (isAddingDriver) return; // Prevent multiple submissions
    
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
      }
      else {
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

const filterData=useMemo(()=>{
  if (!searchTerm) return drivers

  return drivers.filter(item=>
    item.drivername.toLowerCase().includes(searchTerm.toLowerCase())
  )
},[drivers,searchTerm])


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

          <div
            className={`flex-1 ${
              isSidebarCollapsed ? "ml-16" : "ml-64"
            } transition-all duration-300`}
          >
           
            <div className="border-b border-gray-200 bg-white">
              <div className="px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-black">Drivers</h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Manage your driver database
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddDriver(true)}
                    className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add Driver
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
           
              <div className="mb-8">
             
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search drivers by name, license, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                </div>

            {
              customerloading ? (<Spinner/>): (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 p-6">
                  <div className="text-sm text-gray-600">Total Drivers</div>
                  <div className="text-2xl font-bold text-black mt-2">
                    {drivers.length}
                  </div>
                </div>
                
              </div>
            )
          }
              
                </div>

      
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterData.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => handleDriverClick(driver)}
                      className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            {driver.drivername}
                          </h3>
                          <p className="text-sm text-gray-600">{driver.driverphoneno}</p>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {showAddDriver && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <form onSubmit={handleSubmit(handleAddDriver)} className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black">Add New Driver</h2>
                    <button
                      onClick={() => setShowAddDriver(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
  <label className="block text-sm font-medium text-black mb-2">
    Driver Name *
  </label>
  <input
    type="text"
    {...register("drivername",{
      required:"Driver Name is required",
      pattern: {
        value: /^[a-zA-Z\s]{2,100}$/,
        message:
          "Driver name should be 2-100 characters with letters",
      }
    })}
    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
    placeholder="Enter driver's full name"
  />
  {errors.drivername && (
    <p className="text-red-500 text-sm mt-1">{errors.drivername.message}</p>
  )}
</div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone No *
                      </label>
                      <input
                        type="tel"
                        {
                          ...register("driverphoneno",{
                            required:"Phone Number required",
                            pattern:{
                              value: /^[\+]?[0-9][\d]{0,15}$/,
                                message: "Please enter a valid phone number",
                            }
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                        placeholder="Enter Phone No"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={() => setShowAddDriver(false)}
                      className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingDriver}
                      className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
                </form>
              </div>
            )}

            {/* Driver Detail Modal */}
            {showDriverDetail && selectedDriver && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-black">Driver Details</h2>
                    <button
                      onClick={() => setShowDriverDetail(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Personal Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Full Name
                            </label>
                            <p className="text-black font-medium">
                              {selectedDriver.drivername}
                            </p>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Phone No
                            </label>
                            <p className="text-black">{selectedDriver.driverphoneno}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Information & Statistics */}
                    <div className="space-y-6">
                      <div>
                       

                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-black">
                            Quick Actions
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => setShowDriverReport(true)}
                              className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors"
                            >
                              Generate Driver Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={() => setShowDriverDetail(false)}
                      className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Driver Report Modal */}
            {showDriverReport && selectedDriver && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white w-full h-full max-w-6xl max-h-[95vh] overflow-auto relative">
                  <button
                    onClick={() => setShowDriverReport(false)}
                    className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors print:hidden"
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

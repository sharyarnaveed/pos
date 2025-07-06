import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const Data = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrderData, setEditOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Search states for autocomplete
  const [customerSearch, setCustomerSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add this state
  const [isUpdating, setIsUpdating] = useState(false); // Add this state

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      from: "",
      to: "",
      containerNumber: "",
      customerId: "",
      rate: "",
      token: "",
      custWash: "",
      merc: "",
      extra: "",
      extraChargeType: "", // Add this new field
      driverId: "",
      vehicleId: "",
      remarks: "",
      orderType: "import",
      orderDate: new Date().toISOString().split('T')[0],
    },
  });

  // Watch rate, token, custWash, merc, extra for total calculation
  const rate = watch("rate");
  const token = watch("token");
  const custWash = watch("custWash");
  const merc = watch("merc");
  const extra = watch("extra");
  const extraChargeType = watch("extraChargeType"); // Watch extra charge type

  // Calculate subtotal and total with VAT
  const subtotal = useMemo(() => {
    const rateVal = parseFloat(rate) || 0;
    const tokenVal = parseFloat(token) || 0;
    const custWashVal = parseFloat(custWash) || 0;
    const mercVal = parseFloat(merc) || 0;
    const extraVal = parseFloat(extra) || 0;
    return rateVal + tokenVal + custWashVal + mercVal + extraVal;
  }, [rate, token, custWash, merc, extra]);

  // VAT calculated only on rate and extra charges
  const vatableAmount = useMemo(() => {
    const rateVal = parseFloat(rate) || 0;
    const extraVal = parseFloat(extra) || 0;
    return rateVal + extraVal;
  }, [rate, extra]);

  const vat = useMemo(() => {
    return vatableAmount * 0.05; // 5% VAT only on rate and extra
  }, [vatableAmount]);

  const total = useMemo(() => {
    return subtotal + vat;
  }, [subtotal, vat]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers;
    return customers.filter((customer) =>
      customer.customername.toLowerCase().includes(customerSearch.toLowerCase())
    );
  }, [customers, customerSearch]);

  // Filter drivers based on search
  const filteredDrivers = useMemo(() => {
    if (!driverSearch) return drivers;
    return drivers.filter((driver) =>
      driver.drivername.toLowerCase().includes(driverSearch.toLowerCase())
    );
  }, [drivers, driverSearch]);

  // Filter vehicles based on search
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return vehicles;
    return vehicles.filter((vehicle) =>
      vehicle.plateNumber.toLowerCase().includes(vehicleSearch.toLowerCase())
    );
  }, [vehicles, vehicleSearch]);

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const lower = searchTerm.toLowerCase();
    return orders.filter(
      (order) =>
        (order.containerNumber &&
          order.containerNumber.toLowerCase().includes(lower)) ||
        (order.from && order.from.toLowerCase().includes(lower)) ||
        (order.to && order.to.toLowerCase().includes(lower)) ||
        (order["CustomerDetails.customername"] &&
          order["CustomerDetails.customername"]
            .toLowerCase()
            .includes(lower)) ||
        (order["driverDetails.drivername"] &&
          order["driverDetails.drivername"].toLowerCase().includes(lower)) ||
        (order["vehicleDetails.plateNumber"] &&
          order["vehicleDetails.plateNumber"].toLowerCase().includes(lower))
    );
  }, [orders, searchTerm]);

  // Fetch data functions
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewcustomer");
      if (response.data.success) {
        setCustomers(response.data.customerData);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }, []);

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewdriver");
      if (response.data.success) {
        setDrivers(response.data.DriverData);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await api.get("/api/user/viewvehicle");
      if (response.data.success) {
        setVehicles(response.data.VehicleData);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/api/user/vieworders");
      if (response.data.success) {
        

        setOrders(response.data.OrderData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  const checkAccountLogin = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/user/authcheck");
      if (response.data.authenticated) {
        await Promise.all([
          fetchCustomers(),
          fetchDrivers(),
          fetchVehicles(),
          fetchOrders(),
        ]);
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.error("Error checking login:", error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccountLogin();
  }, []);

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setCustomerSearch(customer.customername);
    setValue("customerId", customer.id);
    setShowCustomerDropdown(false);
  };

  // Handle driver selection
  const handleDriverSelect = (driver) => {
    setDriverSearch(driver.drivername);
    setValue("driverId", driver.id);
    setShowDriverDropdown(false);
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setVehicleSearch(vehicle.plateNumber);
    setValue("vehicleId", vehicle.id);
    setShowVehicleDropdown(false);
  };

  const handleAddOrder = async (data) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
      };
      

      const response = await api.post("/api/user/addorder", orderData);
      if (response.data.success) {
        toast.success("Order added successfully", { duration: 2000 });
        reset();
        setCustomerSearch("");
        setDriverSearch("");
        setVehicleSearch("");
        setIsModalOpen(false);
        await fetchOrders();
      } else {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Error adding order", { duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditOrderClick = (order) => {
    setEditOrderData(order);
    setIsEditModalOpen(true);
    setValue("from", order.from || "");
    setValue("to", order.to || "");
    setValue("containerNumber", order.containerNumber || "");
    setValue("customerId", order.customer || ""); // Fixed: use 'customer' instead of 'customerId'
    setCustomerSearch(order["CustomerDetails.customername"] || "");
    setValue("rate", order.rate || "");
    setValue("token", order.token || "");
    setValue("custWash", order.custwash || ""); // Fixed: use 'custwash' instead of 'custWash'
    setValue("merc", order.merc || "");
    setValue("extra", order.extra || "");
    setValue("extraChargeType", order.extratype || ""); // Fixed: use 'extratype' instead of 'extraChargeType'
    setValue("driverId", order.driver || ""); // Fixed: use 'driver' instead of 'driverId'
    setDriverSearch(order["driverDetails.drivername"] || "");
    setValue("vehicleId", order.vehicle || ""); // Fixed: use 'vehicle' instead of 'vehicleId'
    setVehicleSearch(order["vehicleDetails.plateNumber"] || "");
    setValue("remarks", order.remarks || "");
    setValue("orderType", order.type || "import");
    setValue("orderDate", order.date || new Date(order.createdAt).toISOString().split('T')[0]); // Use date or createdAt
  };

  // Add this function to handle edit form submit
  const handleEditOrder = async (data) => {
    if (isUpdating) return; // Prevent multiple submissions
    
    setIsUpdating(true);
    try {
      const updatedOrder = {
        ...data,
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
        id: editOrderData.id,
      };
 
      
      const response = await api.put(
        `/api/user/updateorder/${editOrderData.id}`,
        updatedOrder
      );
      if (response.data.success) {
        toast.success("Order updated successfully", { duration: 2000 });
        setIsEditModalOpen(false);
        setEditOrderData(null);
        reset();
        setCustomerSearch("");
        setDriverSearch("");
        setVehicleSearch("");
        await fetchOrders();
      } else {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error updating order", { duration: 3000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    console.log(order);

    setShowOrderDetail(true);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".customer-dropdown")) {
        setShowCustomerDropdown(false);
      }
      if (!event.target.closest(".driver-dropdown")) {
        setShowDriverDropdown(false);
      }
      if (!event.target.closest(".vehicle-dropdown")) {
        setShowVehicleDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 lg:ml-16 transition-all duration-300 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-2 rounded-md hover:bg-gray-100 flex-shrink-0"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900 truncate mx-4">Orders</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-3 py-1 text-sm rounded flex-shrink-0"
            >
              Add
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 bg-white">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-black">Order Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your shipping orders</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors flex-shrink-0"
              >
                Add New Order
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 lg:p-8">
          {/* Search */}
          <div className="mb-4 lg:mb-6">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Container
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
                        {order.containerNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                        {order["CustomerDetails.customername"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                        {order.from} → {order.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                        {order["driverDetails.drivername"]}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        AED {order.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 uppercase truncate">
                        {order.containerNumber}
                      </h3>
                      <p className="text-sm text-gray-600 uppercase truncate">
                        {order["CustomerDetails.customername"]}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        order.type === "import"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {order.type?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex-shrink-0">Route:</span>
                      <span className="text-gray-900 uppercase text-right truncate ml-2">
                        {order.from} → {order.to}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex-shrink-0">Driver:</span>
                      <span className="text-gray-900 uppercase text-right truncate ml-2">
                        {order["driverDetails.drivername"]}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex-shrink-0">Vehicle:</span>
                      <span className="text-gray-900 uppercase text-right truncate ml-2">
                        {order["vehicleDetails.plateNumber"]}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex-shrink-0">Date:</span>
                      <span className="text-gray-900 text-right ml-2">
                        {new Date(order.date || order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2">
                      <span className="text-gray-500 flex-shrink-0">Amount:</span>
                      <span className="text-gray-900 text-right ml-2">AED {order.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No orders found matching your search.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded"
              >
                Add Your First Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
            <div className="bg-black text-white px-4 lg:px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit(handleAddOrder)} className="p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {/* Route Information */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    From *
                  </label>
                  <input
                    type="text"
                    {...register("from", {
                      required: "From location is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Origin location"
                  />
                  {errors.from && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.from.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    To *
                  </label>
                  <input
                    type="text"
                    {...register("to", { required: "Destination is required" })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Destination location"
                  />
                  {errors.to && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.to.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Container Number *
                  </label>
                  <input
                    type="text"
                    {...register("containerNumber", {
                      required: "Container number is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Container number"
                  />
                  {errors.containerNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.containerNumber.message}
                    </p>
                  )}
                </div>

                {/* Customer Search & Select */}
                <div className="relative customer-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Customer *
                  </label>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                      setValue("customerId", ""); // Clear selection when typing
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search customer..."
                  />
                  {showCustomerDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm uppercase"
                          >
                            {customer.customername}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("customerId", {
                      required: "Customer is required",
                    })}
                  />
                  {errors.customerId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customerId.message}
                    </p>
                  )}
                </div>

                {/* Driver Search & Select */}
                <div className="relative driver-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Driver *
                  </label>
                  <input
                    type="text"
                    value={driverSearch}
                    onChange={(e) => {
                      setDriverSearch(e.target.value);
                      setShowDriverDropdown(true);
                      setValue("driverId", ""); // Clear selection when typing
                    }}
                    onFocus={() => setShowDriverDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search driver..."
                  />
                  {showDriverDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            onClick={() => handleDriverSelect(driver)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {driver.drivername}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No drivers found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("driverId", {
                      required: "Driver is required",
                    })}
                  />
                  {errors.driverId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.driverId.message}
                    </p>
                  )}
                </div>

                
                <div className="relative vehicle-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Vehicle *
                  </label>
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => {
                      setVehicleSearch(e.target.value);
                      setShowVehicleDropdown(true);
                      setValue("vehicleId", ""); 
                    }}
                    onFocus={() => setShowVehicleDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search vehicle..."
                  />
                  {showVehicleDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            onClick={() => handleVehicleSelect(vehicle)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {vehicle.plateNumber}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No vehicles found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("vehicleId", {
                      required: "Vehicle is required",
                    })}
                  />
                  {errors.vehicleId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vehicleId.message}
                    </p>
                  )}
                </div>

            
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("rate")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Token
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("token")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cust Wash
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("custWash")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Merc
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("merc")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Extra
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("extra")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                  
                 
                  {extra && parseFloat(extra) > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-black mb-2">
                        Extra Charge Type *
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="custom-inspection"
                            value="custom-inspection"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="custom-inspection" className="text-sm text-gray-700">
                            Custom Inspection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="municipality-inspection"
                            value="municipality-inspection"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="municipality-inspection" className="text-sm text-gray-700">
                            Municipality Inspection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="waiting-charges"
                            value="waiting-charges"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="waiting-charges" className="text-sm text-gray-700">
                            Waiting Charges
                          </label>
                        </div>
                      </div>
                      {errors.extraChargeType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.extraChargeType.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subtotal
                  </label>
                  <input
                    type="text"
                    value={`AED ${subtotal.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    VAT (5%)
                  </label>
                  <input
                    type="text"
                    value={`AED ${vat.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Total
                  </label>
                  <input
                    type="text"
                    value={`AED ${total.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-semibold"
                    readOnly
                  />
                </div>

                {/* Order Type - MAKE EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Type *
                  </label>
                  <select
                    {...register("orderType", {
                      required: "Order type is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  >
                    <option value="import">Import</option>
                    <option value="export">Export</option>
                  </select>
                  {errors.orderType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.orderType.message}
                    </p>
                  )}
                </div>

                {/* Order Date */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Date *
                  </label>
                  <input
                    type="date"
                    {...register("orderDate", {
                      required: "Order date is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  {errors.orderDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.orderDate.message}
                    </p>
                  )}
                </div>

                {/* Remarks */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Remarks
                  </label>
                  <textarea
                    {...register("remarks")}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm resize-none"
                    placeholder="Additional notes or remarks"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Edit Order</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditOrderData(null);
                  reset();
                  setCustomerSearch("");
                  setDriverSearch("");
                  setVehicleSearch("");
                }}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>
            {/* Modal Body */}
            <form onSubmit={handleSubmit(handleEditOrder)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    From (Read Only)
                  </label>
                  <input
                    type="text"
                    {...register("from")}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Origin location"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    To (Read Only)
                  </label>
                  <input
                    type="text"
                    {...register("to")}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Destination location"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Container Number (Read Only)
                  </label>
                  <input
                    type="text"
                    {...register("containerNumber")}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Container number"
                    readOnly
                  />
                </div>

             
                <div className="relative customer-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Customer *
                  </label>
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setShowCustomerDropdown(true);
                      setValue("customerId", ""); // Clear selection when typing
                    }}
                    onFocus={() => setShowCustomerDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search customer..."
                  />
                  {showCustomerDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm uppercase"
                          >
                            {customer.customername}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("customerId", {
                      required: "Customer is required",
                    })}
                  />
                  {errors.customerId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customerId.message}
                    </p>
                  )}
                </div>

             
                <div className="relative driver-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Driver *
                  </label>
                  <input
                    type="text"
                    value={driverSearch}
                    onChange={(e) => {
                      setDriverSearch(e.target.value);
                      setShowDriverDropdown(true);
                      setValue("driverId", ""); // Clear selection when typing
                    }}
                    onFocus={() => setShowDriverDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search driver..."
                  />
                  {showDriverDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            onClick={() => handleDriverSelect(driver)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {driver.drivername}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No drivers found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("driverId", {
                      required: "Driver is required",
                    })}
                  />
                  {errors.driverId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.driverId.message}
                    </p>
                  )}
                </div>

               
                <div className="relative vehicle-dropdown">
                  <label className="block text-sm font-medium text-black mb-2">
                    Vehicle *
                  </label>
                  <input
                    type="text"
                    value={vehicleSearch}
                    onChange={(e) => {
                      setVehicleSearch(e.target.value);
                      setShowVehicleDropdown(true);
                      setValue("vehicleId", ""); // Clear selection when typing
                    }}
                    onFocus={() => setShowVehicleDropdown(true)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Search vehicle..."
                  />
                  {showVehicleDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <div
                            key={vehicle.id}
                            onClick={() => handleVehicleSelect(vehicle)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {vehicle.plateNumber}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          No vehicles found
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="hidden"
                    {...register("vehicleId", {
                      required: "Vehicle is required",
                    })}
                  />
                  {errors.vehicleId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.vehicleId.message}
                    </p>
                  )}
                </div>

             
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("rate")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Token
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("token")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cust Wash
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("custWash")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Merc
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("merc")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Extra
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("extra")}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                  
                 
                  {extra && parseFloat(extra) > 0 && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-black mb-2">
                        Extra Charge Type *
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="custom-inspection"
                            value="custom-inspection"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="custom-inspection" className="text-sm text-gray-700">
                            Custom Inspection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="municipality-inspection"
                            value="municipality-inspection"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="municipality-inspection" className="text-sm text-gray-700">
                            Municipality Inspection
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="waiting-charges"
                            value="waiting-charges"
                            {...register("extraChargeType", {
                              required: extra && parseFloat(extra) > 0 ? "Please select extra charge type" : false,
                            })}
                            className="mr-2"
                          />
                          <label htmlFor="waiting-charges" className="text-sm text-gray-700">
                            Waiting Charges
                          </label>
                        </div>
                      </div>
                      {errors.extraChargeType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.extraChargeType.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Subtotal
                  </label>
                  <input
                    type="text"
                    value={`AED ${subtotal.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    VAT (5%)
                  </label>
                  <input
                    type="text"
                    value={`AED ${vat.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-medium"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Total
                  </label>
                  <input
                    type="text"
                    value={`AED ${total.toFixed(2)}`}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm font-semibold"
                    readOnly
                  />
                </div>

                {/* Order Type - MAKE EDITABLE */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Type *
                  </label>
                  <select
                    {...register("orderType", {
                      required: "Order type is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  >
                    <option value="import">Import</option>
                    <option value="export">Export</option>
                  </select>
                  {errors.orderType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.orderType.message}
                    </p>
                  )}
                </div>

                {/* Order Date */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Date *
                  </label>
                  <input
                    type="date"
                    {...register("orderDate", {
                      required: "Order date is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                  {errors.orderDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.orderDate.message}
                    </p>
                  )}
                </div>

                {/* Remarks - EDITABLE */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-black mb-2">
                    Remarks
                  </label>
                  <textarea
                    {...register("remarks")}
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
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditOrderData(null);
                    reset();
                    setCustomerSearch("");
                    setDriverSearch("");
                    setVehicleSearch("");
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Order Details - {selectedOrder.containerNumber}
              </h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Order Information */}
                <div>
                  <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Order Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Container Number:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder.containerNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder.from} → {selectedOrder.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder["CustomerDetails.customername"]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder["driverDetails.drivername"]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium uppercase">
                        {selectedOrder["vehicleDetails.plateNumber"]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Type:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedOrder.type === "import"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedOrder.type?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">
                        {new Date(selectedOrder.date || selectedOrder.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedOrder.extratype && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Extra Charge Type:</span>
                        <span className="font-medium uppercase">
                          {selectedOrder.extratype.replace('-', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div>
                  <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Financial Breakdown
                  </h4>
                  <div className="bg-gray-50 p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate:</span>
                      <span className="font-medium">
                        AED {selectedOrder.rate || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Token:</span>
                      <span className="font-medium">
                        AED {selectedOrder.token || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cust Wash:</span>
                      <span className="font-medium">
                        AED {selectedOrder.custwash || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merc:</span>
                      <span className="font-medium">
                        AED {selectedOrder.merc || "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extra:</span>
                      <div className="text-right">
                        <span className="font-medium">
                          AED {selectedOrder.extra || "0.00"}
                        </span>
                        {selectedOrder.extratype && (
                          <div className="text-xs text-gray-500 uppercase">
                            ({selectedOrder.extratype.replace('-', ' ')})
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Subtotal:</span>
                        <span className="font-medium text-black">
                          AED {(
                            (parseFloat(selectedOrder.rate) || 0) +
                            (parseFloat(selectedOrder.token) || 0) +
                            (parseFloat(selectedOrder.custwash) || 0) +
                            (parseFloat(selectedOrder.merc) || 0) +
                            (parseFloat(selectedOrder.extra) || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-medium text-gray-600">VAT (5%):</span>
                        <span className="font-medium text-black">
                          AED {selectedOrder.vat}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-300">
                        <span className="font-semibold text-black">Total:</span>
                        <span className="font-bold text-black text-lg">
                          AED {selectedOrder.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {selectedOrder.remarks && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Remarks
                  </h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded uppercase">
                    {selectedOrder.remarks}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowOrderDetail(false);
                    handleEditOrderClick(selectedOrder);
                  }}
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
                >
                  Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Data;

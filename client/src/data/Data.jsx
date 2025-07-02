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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      driverId: "",
      vehicleId: "",
      remarks: "",
      orderType: "import",
    },
  });

  // Watch rate, token, custWash, merc, extra for total calculation
  const rate = watch("rate");
  const token = watch("token");
  const custWash = watch("custWash");
  const merc = watch("merc");
  const extra = watch("extra");

  // Calculate subtotal and total with VAT
  const subtotal = useMemo(() => {
    const rateVal = parseFloat(rate) || 0;
    const tokenVal = parseFloat(token) || 0;
    const custWashVal = parseFloat(custWash) || 0;
    const mercVal = parseFloat(merc) || 0;
    const extraVal = parseFloat(extra) || 0;
    return rateVal + tokenVal + custWashVal + mercVal + extraVal;
  }, [rate, token, custWash, merc, extra]);

  const vat = useMemo(() => {
    return subtotal * 0.05; // 5% VAT
  }, [subtotal]);

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
        console.log(response.data.OrderData);

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
      console.log(orderData);

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
    setValue("customerId", order.customerId || "");
    setCustomerSearch(order["CustomerDetails.customername"] || "");
    setValue("rate", order.rate || "");
    setValue("token", order.token || "");
    setValue("custWash", order.custWash || "");
    setValue("merc", order.merc || "");
    setValue("extra", order.extra || "");
    setValue("driverId", order.driverId || "");
    setDriverSearch(order["driverDetails.drivername"] || "");
    setValue("vehicleId", order.vehicleId || "");
    setVehicleSearch(order["vehicleDetails.plateNumber"] || "");
    setValue("remarks", order.remarks || "");
    setValue("orderType", order.type || "import");
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
      console.log(updatedOrder);
      
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
                  Order Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage your shipping orders
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add New Order
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search orders by container number, route, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-2xl font-bold text-black mt-2">
                {orders.length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Import Orders</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {orders.filter((o) => o.type === "import").length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Export Orders</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {orders.filter((o) => o.type === "export").length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-black mt-2">
                AED{" "}
                {orders
                  .reduce((sum, o) => sum + parseFloat(o.total || 0), 0)
                  .toFixed(2)}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white border border-gray-200">
            {/* Table Header */}
            <div className="bg-black text-white">
              <div className="grid grid-cols-8 gap-4 px-6 py-4 text-sm font-medium">
                <div>Container #</div>
                <div>Route</div>
                <div>Customer</div>
                <div>Driver</div>
                <div>Vehicle</div>
                <div>Type</div>
                <div>Total</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-8 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="font-medium text-black">
                    {order.containerNumber}
                  </div>
                  <div className="text-gray-600">
                    {order.from} → {order.to}
                  </div>
                  <div className="text-gray-600">
                    {order["CustomerDetails.customername"]}
                  </div>
                  <div className="text-gray-600">
                    {order["driverDetails.drivername"]}
                  </div>
                  <td>{order["vehicleDetails.plateNumber"]}</td>

                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.type === "import"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.type?.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-medium text-black">
                    AED {order.total}
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOrderClick(order)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(handleAddOrder)} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                    placeholder="Search customer..."
                  />
                  {showCustomerDropdown && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <div
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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

                {/* Vehicle Search & Select */}
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
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
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

                {/* Financial Fields */}
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

                {/* Order Type */}
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
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
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
                {/* Route Information - READ ONLY */}
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

                {/* Customer - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Customer (Read Only)
                  </label>
                  <input
                    type="text"
                    value={customerSearch}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Customer name"
                    readOnly
                  />
                  <input
                    type="hidden"
                    {...register("customerId")}
                  />
                </div>

                {/* Driver - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Driver (Read Only)
                  </label>
                  <input
                    type="text"
                    value={driverSearch}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Driver name"
                    readOnly
                  />
                  <input
                    type="hidden"
                    {...register("driverId")}
                  />
                </div>

                {/* Vehicle - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Vehicle (Read Only)
                  </label>
                  <input
                    type="text"
                    value={vehicleSearch}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    placeholder="Vehicle plate number"
                    readOnly
                  />
                  <input
                    type="hidden"
                    {...register("vehicleId")}
                  />
                </div>

                {/* Financial Fields - EDITABLE */}
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

                {/* Order Type - READ ONLY */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Order Type (Read Only)
                  </label>
                  <input
                    type="text"
                    {...register("orderType")}
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-600 text-sm cursor-not-allowed"
                    readOnly
                  />
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
                      <span className="font-medium">
                        {selectedOrder.containerNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">
                        {selectedOrder.from} → {selectedOrder.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">
                        {selectedOrder["CustomerDetails.customername"]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium">
                        {selectedOrder["driverDetails.drivername"]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">
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
                        AED {selectedOrder.custWash || "0.00"}
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
                      <span className="font-medium">
                        AED {selectedOrder.extra || "0.00"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Subtotal:</span>
                        <span className="font-medium text-black">
                          AED {(
                            (parseFloat(selectedOrder.rate) || 0) +
                            (parseFloat(selectedOrder.token) || 0) +
                            (parseFloat(selectedOrder.custWash) || 0) +
                            (parseFloat(selectedOrder.merc) || 0) +
                            (parseFloat(selectedOrder.extra) || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="font-medium text-gray-600">VAT (5%):</span>
                        <span className="font-medium text-black">
                          AED {(
                            ((parseFloat(selectedOrder.rate) || 0) +
                            (parseFloat(selectedOrder.token) || 0) +
                            (parseFloat(selectedOrder.custWash) || 0) +
                            (parseFloat(selectedOrder.merc) || 0) +
                            (parseFloat(selectedOrder.extra) || 0)) * 0.05
                          ).toFixed(2)}
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
                  <p className="text-gray-700 bg-gray-50 p-4 rounded">
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

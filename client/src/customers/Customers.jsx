import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Links, useNavigate } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
const Customers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, SetLoading] = useState(false);
  const [customerloading, setcustoemrloading] = useState(false);
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isSaving, SetisSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      customername: "",
      companyname: "",
      phoneno: "",
      mainowner: "",
      operator: "",
      taxnumber: "",
      address: "",
    },
  });

  const filterData = useMemo(() => {
    if (!searchTerm) return customers;

    return customers.filter((item) =>
      item.customername.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const viewCustomers = useCallback(async () => {
    setcustoemrloading(true);
    try {
      const responce = await api.get("/api/user/viewcustomer");
      console.log(responce.data);
      if (responce.data.success) {
        setcustoemrloading(false);
        setCustomers(responce.data.customerData);
        console.log(customers);
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

  const handleAddCustomer = async (data) => {
    SetisSaving(true);
    try {
      const responce = await api.post("/api/user/addcustomer", data);
      console.log(responce.data);
      if (responce.data.success == true) {
        toast.success(responce.data.message, {
          duration: 2000,
        });
        await viewCustomers();
        setShowAddCustomer(false);
        reset();
      } else {
        toast.error(responce.data.message, {
          duration: 2000,
        });
        setShowAddCustomer(true);
      }
    } catch (error) {
      console.log("error in adding customer", error);
      toast.error("error in adding", {
        duration: 3000,
      });
    }
    SetisSaving(false);
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetail(true);
  };

  const checkAccountLogin = async () => {
    SetLoading(true);
    try {
      const responce = await api.get("/api/user/authcheck");
      console.log(responce.data);
      if (responce.data.authenticated == true) {
        SetLoading(false);
        await viewCustomers();
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
                    <h1 className="text-2xl font-bold text-black">Customers</h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Manage your customer database
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddCustomer(true)}
                    className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Search and Stats */}
              <div className="mb-8">
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search customers by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="text-sm text-gray-600">Total Customers</div>
                    <div className="text-2xl font-bold text-black mt-2">
                      {customers.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customers Grid */}
              {customerloading ? (
                <Spinner />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterData.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerClick(customer)}
                      className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-black">
                            {customer.customername}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-black">{customer.phoneno}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Orders:</span>
                          <span className="text-black font-medium">
                            {customer.totalOrders}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-black font-medium">
                            {customer.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Customer Modal */}
          {showAddCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <form
                onSubmit={handleSubmit(handleAddCustomer)}
                className="bg-white p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg lg:text-xl font-bold text-black">
                    Add New Customer
                  </h2>
                  <button
                    onClick={() => setShowAddCustomer(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      {...register("customername", {
                        required: "Customer Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]{2,70}$/,
                          message:
                            "Name should only contain letters and spaces (2-50 characters)",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter customer name"
                    />
                    {errors.customername && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.customername.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      {...register("companyname", {
                        required: "Company Name is required",
                        pattern: {
                          value: /^[a-zA-Z0-9\s&.,'-]{2,100}$/,
                          message:
                            "Company name should be 2-100 characters with letters, numbers, and basic punctuation",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter company name"
                    />
                    {errors.companyname && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.companyname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register("phoneno", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^[\+]?[0-9][\d]{0,15}$/,
                          message: "Please enter a valid phone number",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter phone number"
                    />
                    {errors.phoneno && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phoneno.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Main Owner Name *
                    </label>
                    <input
                      type="text"
                      {...register("mainowner", {
                        required: "Main Owner Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]{2,50}$/,
                          message:
                            "Name should only contain letters and spaces (2-50 characters)",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter main owner name"
                    />
                    {errors.mainowner && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.mainowner.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Address
                    </label>
                    <textarea
                      {...register("address", {
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.-]{0,200}$/,
                          message:
                            "Address should contain only letters, numbers, spaces, and basic punctuation (max 200 characters)",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm h-20 resize-none"
                      placeholder="Enter address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Operator Name *
                    </label>
                    <input
                      type="text"
                      {...register("operator", {
                        required: "Operator Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]{2,50}$/,
                          message:
                            "Name should only contain letters and spaces (2-50 characters)",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter operator name"
                    />
                    {errors.operator && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.operator.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Tax Number *
                    </label>
                    <input
                      type="text"
                      {...register("taxnumber", {
                        required: "Tax Number is required",
                        pattern: {
                          value: /^[0-9]{8,30}$/,
                          message: "Tax number should be 8-30 digits only",
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                      placeholder="Enter tax number"
                    />
                    {errors.taxnumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.taxnumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={() => setShowAddCustomer(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Add Customer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Customer Detail Modal */}
          {showCustomerDetail && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-black">
                    Customer Details
                  </h2>
                  <button
                    onClick={() => setShowCustomerDetail(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2">
                      Basic Information
                    </h3>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Customer Name
                      </label>
                      <p className="text-black font-medium">
                        {selectedCustomer.customername}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Phone
                      </label>
                      <p className="text-black">{selectedCustomer.phoneno}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Operator
                      </label>
                      <p className="text-black">{selectedCustomer.operator}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Main Owner
                      </label>
                      <p className="text-black">{selectedCustomer.mainowner}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Company Name
                      </label>
                      <p className="text-black">
                        {selectedCustomer.companyname}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Tax Number
                      </label>
                      <p className="text-black">{selectedCustomer.taxnumber}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Address
                      </label>
                      <p className="text-black">{selectedCustomer.address}</p>
                    </div>
                  </div>

                  {/* Order Statistics */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-black">
                        Quick Actions
                      </h4>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => navigate("/data")}
                          className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors"
                        >
                          Create New Order
                        </button>
                        <a
                          href={`/invoicewithoutvat/${selectedCustomer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Generate Detail Invoice Without VAT
                        </a>
                        <a
                          href={`/generatevatinvoie/${selectedCustomer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Generate Detail Invoice With VAT
                        </a>
                        <a
                          href={`/overviewinvoice/${selectedCustomer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Generate Overview Invoice
                        </a>

                        <a
                          href={`/customerpayment/${selectedCustomer.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Generate Payment Invoice
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setShowCustomerDetail(false)}
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

export default Customers;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Links, useNavigate } from "react-router-dom";
import api from "../api";
import Spinner from "../components/Spinner";
// Import the invoice components
import GenerateInvoice from "../generatestuff/GenerateInvoice";
import GenerateVatInvoice from "../generatestuff/GenerateVatInvoice";
import OverviewInvoice from "../generatestuff/OverviewInvoice";
import PaymentInvoice from "../generatestuff/PaymentInvoice";

const Customers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false); // Add this line
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, SetLoading] = useState(false);
  const [customerloading, setcustoemrloading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // Add this line
  
  // Add state for invoice modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showVatInvoiceModal, setShowVatInvoiceModal] = useState(false);
  const [showOverviewInvoiceModal, setShowOverviewInvoiceModal] = useState(false);
  const [showPaymentInvoiceModal, setShowPaymentInvoiceModal] = useState(false);
  
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    setValue, // Add this line
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
    if (isSaving) return; // Prevent multiple submissions
    
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
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

  // Add edit customer handler
  const handleEditCustomer = async (data) => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const response = await api.put(`/api/user/updatecustomer/${selectedCustomer.id}`, data);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message, {
          duration: 2000,
        });
        await viewCustomers();
        setShowEditCustomer(false);
        setShowCustomerDetail(false);
        resetEdit();
      } else {
        toast.error(response.data.message, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.log("error in updating customer", error);
      toast.error("Error updating customer", {
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Add function to handle edit button click
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setValueEdit("customername", customer.customername);
    setValueEdit("companyname", customer.companyname);
    setValueEdit("phoneno", customer.phoneno);
    setValueEdit("mainowner", customer.mainowner);
    setValueEdit("operator", customer.operator);
    setValueEdit("taxnumber", customer.taxnumber);
    setValueEdit("address", customer.address);
    setShowEditCustomer(true);
  };

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
                <h1 className="text-lg font-semibold text-gray-900">Customers</h1>
                <button
                  onClick={() => setShowAddCustomer(true)}
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
                    <h1 className="text-xl md:text-2xl font-bold text-black">Customers</h1>
                    <p className="text-gray-600 text-xs md:text-sm mt-1">
                      Manage your customer database
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddCustomer(true)}
                    className="bg-black text-white px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto"
                  >
                    Add Customer
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
                    placeholder="Search customers by name..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">Total Customers</div>
                    <div className="text-lg lg:text-2xl font-bold text-black mt-2">
                      {customers.length}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg shadow-sm">
                    <div className="text-xs lg:text-sm text-gray-600">Companies</div>
                    <div className="text-lg lg:text-2xl font-bold text-blue-600 mt-2">
                      {customers.length}
                    </div>
                  </div>

                </div>
              </div>

              {/* Customers Grid */}
              {customerloading ? (
                <Spinner />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
                  {filterData.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerClick(customer)}
                      className="bg-white border border-gray-200 p-4 lg:p-6 rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
                    >
                      <div className="flex flex-col space-y-3">
                        {/* Customer Avatar & Name */}
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg lg:text-xl font-bold">
                              {customer.customername.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h3 className="text-base lg:text-lg font-semibold text-black truncate uppercase">
                            {customer.customername}
                          </h3>
                          <p className="text-xs lg:text-sm text-gray-600 mt-1 truncate uppercase">
                            {customer.companyname}
                          </p>
                        </div>

                        {/* Customer Details */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs lg:text-sm">
                            <span className="text-gray-500">Phone:</span>
                            <span className="text-black font-medium truncate ml-2">
                              {customer.phoneno}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs lg:text-sm">
                            <span className="text-gray-500">Owner:</span>
                            <span className="text-black truncate ml-2 uppercase">
                              {customer.mainowner}
                            </span>
                          </div>
                        </div>

                      
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {filterData.length === 0 && !customerloading && (
                <div className="text-center py-12">
                  <div className="text-4xl lg:text-6xl mb-4">👥</div>
                  <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                    No customers found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? `No customers match "${searchTerm}"` : "Start by adding your first customer"}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowAddCustomer(true)}
                      className="mt-4 bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      Add First Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Add Customer Modal - Enhanced Responsive */}
          {showAddCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form
                onSubmit={handleSubmit(handleAddCustomer)}
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Add New Customer
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomer(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter tax number"
                      />
                      {errors.taxnumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.taxnumber.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm h-20 resize-none uppercase"
                        placeholder="Enter address"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowAddCustomer(false)}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full sm:w-auto bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Adding...
                        </>
                      ) : (
                        "Add Customer"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Customer Detail Modal - Enhanced Responsive */}
          {showCustomerDetail && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full max-w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Customer Details
                    </h2>
                    <button
                      onClick={() => setShowCustomerDetail(false)}
                      className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Basic Information */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Basic Information
                        </h3>

                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Customer Name
                            </label>
                            <p className="text-black font-medium break-words uppercase">
                              {selectedCustomer.customername}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Company Name
                            </label>
                            <p className="text-black break-words uppercase">
                              {selectedCustomer.companyname}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Phone
                            </label>
                            <p className="text-black">{selectedCustomer.phoneno}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Main Owner
                            </label>
                            <p className="text-black uppercase">{selectedCustomer.mainowner}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Operator
                            </label>
                            <p className="text-black uppercase">{selectedCustomer.operator}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Tax Number
                            </label>
                            <p className="text-black">{selectedCustomer.taxnumber}</p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                            <label className="text-sm font-medium text-gray-600">
                              Address
                            </label>
                            <p className="text-black break-words uppercase">{selectedCustomer.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                          Quick Actions
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 gap-2">
                            <button
                              onClick={() => {
                                setShowCustomerDetail(false);
                                handleEditClick(selectedCustomer);
                              }}
                              className="w-full px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-lg"
                            >
                              Edit Customer Details
                            </button>
                            <button
                              onClick={() => navigate("/data")}
                              className="w-full px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors rounded-lg"
                            >
                              Create New Order
                            </button>
                            <button
                              onClick={() => setShowInvoiceModal(true)}
                              className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Generate Detail Invoice Without VAT
                            </button>
                            <button
                              onClick={() => setShowVatInvoiceModal(true)}
                              className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Generate Detail Invoice With VAT
                            </button>
                            <button
                              onClick={() => setShowOverviewInvoiceModal(true)}
                              className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Generate Overview Invoice
                            </button>
                            <button
                              onClick={() => setShowPaymentInvoiceModal(true)}
                              className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                            >
                              Generate Payment Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 lg:mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowCustomerDetail(false)}
                      className="w-full sm:w-auto px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Customer Modal */}
          {showEditCustomer && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <form
                onSubmit={handleSubmitEdit(handleEditCustomer)}
                className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-bold text-black">
                      Edit Customer Details
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCustomer(false);
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
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("customername", {
                          required: "Customer Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s]{2,70}$/,
                            message:
                              "Name should only contain letters and spaces (2-70 characters)",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter customer name"
                      />
                      {errorsEdit.customername && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.customername.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("companyname", {
                          required: "Company Name is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s&.,'-]{2,100}$/,
                            message:
                              "Company name should be 2-100 characters with letters, numbers, and basic punctuation",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter company name"
                      />
                      {errorsEdit.companyname && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.companyname.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        {...registerEdit("phoneno", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[\+]?[0-9][\d]{0,15}$/,
                            message: "Please enter a valid phone number",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter phone number"
                      />
                      {errorsEdit.phoneno && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.phoneno.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Main Owner Name *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("mainowner", {
                          required: "Main Owner Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s]{2,50}$/,
                            message:
                              "Name should only contain letters and spaces (2-50 characters)",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter main owner name"
                      />
                      {errorsEdit.mainowner && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.mainowner.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Operator Name *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("operator", {
                          required: "Operator Name is required",
                          pattern: {
                            value: /^[a-zA-Z\s]{2,50}$/,
                            message:
                              "Name should only contain letters and spaces (2-50 characters)",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                        placeholder="Enter operator name"
                      />
                      {errorsEdit.operator && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.operator.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Tax Number *
                      </label>
                      <input
                        type="text"
                        {...registerEdit("taxnumber", {
                          required: "Tax Number is required",
                          pattern: {
                            value: /^[0-9]{8,30}$/,
                            message: "Tax number should be 8-30 digits only",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                        placeholder="Enter tax number"
                      />
                      {errorsEdit.taxnumber && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.taxnumber.message}
                        </p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">
                        Address
                      </label>
                      <textarea
                        {...registerEdit("address", {
                          pattern: {
                            value: /^[a-zA-Z0-9\s,.-]{0,200}$/,
                            message:
                              "Address should contain only letters, numbers, spaces, and basic punctuation (max 200 characters)",
                          },
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm h-20 resize-none uppercase"
                        placeholder="Enter address"
                      />
                      {errorsEdit.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {errorsEdit.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditCustomer(false);
                        resetEdit();
                      }}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Updating...
                        </>
                      ) : (
                        "Update Customer"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Invoice Modals - Enhanced Responsive */}
          {showInvoiceModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full h-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <GenerateInvoice customerid={selectedCustomer.id} />
              </div>
            </div>
          )}

          {showVatInvoiceModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full h-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={() => setShowVatInvoiceModal(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <GenerateVatInvoice customerid={selectedCustomer.id} />
              </div>
            </div>
          )}

          {showOverviewInvoiceModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full h-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={() => setShowOverviewInvoiceModal(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <OverviewInvoice customerid={selectedCustomer.id} />
              </div>
            </div>
          )}

          {showPaymentInvoiceModal && selectedCustomer && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
              <div className="bg-white w-full h-full max-w-full sm:max-w-6xl max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={() => setShowPaymentInvoiceModal(false)}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 bg-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <PaymentInvoice customerid={selectedCustomer.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Customers;

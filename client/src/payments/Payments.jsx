import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import api from "../api";

const Payments = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    searchQuery: "",
    paymentStatus: "all",
  });

  const [orders, setOrders] = useState([]);

  const getallorder = useCallback(async () => {
    try {
      const responce = await api.get("/api/user/vieworders");
   
      setOrders(responce.data.OrderData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again later.", {
        duration: 3000,
      });
    }
  }, []);

  useEffect(() => {
    getallorder();
  }, []);

  const getPaymentStatus = (order) => {
    const paidAmount = order.paidamount || 0;
    const totalAmount = order.total;

    if (paidAmount >= totalAmount) return "paid";
    if (paidAmount > 0) return "partial";
    return "unpaid";
  };

  const getRemainingAmount = (order) => {
    return Math.max(0, order.total - (order.paidamount || 0));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePartialPayment = async () => {
    if (isProcessingPayment) return; // Prevent multiple clicks
    
    setIsProcessingPayment(true); // Start loading
   

    try {
      const responce = await api.put(
        `/api/user/addpayment/${selectedOrder.id}`,
        {
          amount: parseFloat(paymentAmount),
        }
      );
      if (responce.data.success) {
        toast.success("Payment added successfully!", {
          duration: 3000,
        });
      }
      await getallorder();
 
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.", {
        duration: 3000,
      });
    } finally {
      setIsProcessingPayment(false); // Stop loading
    }

    setPaymentAmount("");
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.containerNumber || "")
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      String(order["CustomerDetails.customername"] || "")
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      String(order["CustomerDetails.phoneno"] || "").toString().includes(filters.searchQuery);

    const matchesStatus =
      filters.paymentStatus === "all" ||
      getPaymentStatus(order) === filters.paymentStatus;

    const matchesDate =
      (!filters.startDate ||
        new Date(order.date) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(order.date) <= new Date(filters.endDate));

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleClearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      searchQuery: "",
      paymentStatus: "all",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
            <h1 className="text-lg font-semibold text-gray-900">PAYMENTS</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-3 lg:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              PAYMENT MANAGEMENT
            </h1>
            <p className="text-gray-600">
              MANAGE ORDER PAYMENTS AND TRACKING EFFICIENTLY
            </p>
          </div>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6 mb-4 lg:mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
              SEARCH & FILTER ORDERS
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
              {/* Search Bar */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEARCH ORDERS
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by order number, customer..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters({ ...filters, searchQuery: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm lg:text-base"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAYMENT STATUS
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm lg:text-base"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="paid">FULLY PAID</option>
                  <option value="partial">PARTIALLY PAID</option>
                  <option value="unpaid">UNPAID</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DATE RANGE
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="flex-1 px-3 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm lg:text-base"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="flex-1 px-3 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm lg:text-base"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-3 lg:mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-3 lg:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs lg:text-sm"
              >
                CLEAR FILTERS
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs lg:text-sm text-gray-600 font-medium">
                    TOTAL ORDERS
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-gray-900 mt-1">
                    {filteredOrders.length}
                  </div>
                </div>
                <div className="text-lg lg:text-2xl opacity-80">📋</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs lg:text-sm text-gray-600 font-medium">
                    FULLY PAID
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-green-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "paid"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-lg lg:text-2xl opacity-80">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs lg:text-sm text-gray-600 font-medium">
                    PARTIALLY PAID
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-yellow-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "partial"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-lg lg:text-2xl opacity-80">⏳</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs lg:text-sm text-gray-600 font-medium">
                    UNPAID
                  </div>
                  <div className="text-lg lg:text-2xl font-bold text-red-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "unpaid"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-lg lg:text-2xl opacity-80">❌</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            {/* Orders List */}
            <div className="order-2 xl:order-1 xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-3 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">
                  ORDERS LIST
                </h3>
                <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        selectedOrder?.id === order.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-base lg:text-lg">
                            {String(order.containerNumber || "").toUpperCase()}
                          </h4>
                          <p className="text-gray-600 font-medium text-sm lg:text-base">
                            {String(order["CustomerDetails.customername"] || "").toUpperCase()}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {order["CustomerDetails.phoneno"]}
                          </p>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {String(order.from || "").toUpperCase()} → {String(order.to || "").toUpperCase()}
                          </p>
                        </div>
                        <div className="flex sm:flex-col sm:text-right items-start sm:items-end space-x-2 sm:space-x-0 sm:space-y-1">
                          <span
                            className={`inline-block px-2 lg:px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              getPaymentStatus(order)
                            )}`}
                          >
                            {getPaymentStatus(order).toUpperCase()}
                          </span>
                          <p className="text-xs lg:text-sm text-gray-500">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 lg:gap-4 text-xs lg:text-sm bg-gray-50 p-2 lg:p-3 rounded">
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            TOTAL
                          </span>
                          <span className="font-bold text-gray-900 text-xs lg:text-sm">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            PAID
                          </span>
                          <span className="font-bold text-green-600 text-xs lg:text-sm">
                            ${(order.paidamount || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            DUE
                          </span>
                          <span className="font-bold text-red-600 text-xs lg:text-sm">
                            ${getRemainingAmount(order).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8 lg:py-12">
                      <div className="text-4xl lg:text-6xl mb-4">🔍</div>
                      <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                        NO ORDERS FOUND
                      </h3>
                      <p className="text-gray-500 text-sm">
                        TRY ADJUSTING YOUR SEARCH FILTERS
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details Panel */}
            <div className="order-1 xl:order-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {selectedOrder ? (
                <>
                  <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 lg:hidden">
                      PAYMENT DETAILS
                    </h3>
                    
                    {/* Order Summary */}
                    <div className="bg-blue-50 rounded-lg p-3 lg:p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                        ORDER SUMMARY
                      </h4>
                      <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">CONTAINER:</span>
                          <span className="font-semibold break-all">
                            {String(selectedOrder.containerNumber || "").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">CUSTOMER:</span>
                          <span className="font-semibold text-right">
                            {String(selectedOrder["CustomerDetails.customername"] || "").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PHONE:</span>
                          <span className="text-right">
                            {selectedOrder["CustomerDetails.phoneno"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROUTE:</span>
                          <span className="text-right">
                            {String(selectedOrder.from || "").toUpperCase()} → {String(selectedOrder.to || "").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DRIVER:</span>
                          <span className="text-right">
                            {String(selectedOrder["driverDetails.drivername"] || "").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">VEHICLE:</span>
                          <span className="text-right">
                            {String(selectedOrder["vehicleDetails.plateNumber"] || "").toUpperCase()} ({String(selectedOrder["vehicleDetails.type"] || "").toUpperCase()})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">DATE:</span>
                          <span className="text-right">
                            {new Date(selectedOrder.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-3 lg:p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">
                        PAYMENT SUMMARY
                      </h4>
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex justify-between text-base lg:text-lg">
                          <span className="text-gray-600">TOTAL AMOUNT:</span>
                          <span className="font-bold text-gray-900">
                            ${selectedOrder.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-base lg:text-lg">
                          <span className="text-gray-600">PAID AMOUNT:</span>
                          <span className="font-bold text-green-600">
                            ${(selectedOrder.paidamount || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 pt-2 lg:pt-3">
                          <div className="flex justify-between text-lg lg:text-xl">
                            <span className="font-semibold text-gray-700">
                              OUTSTANDING:
                            </span>
                            <span className="font-bold text-red-600">
                              ${getRemainingAmount(selectedOrder).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Breakdown */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 lg:mb-3 text-sm lg:text-base">
                        COST BREAKDOWN
                      </h4>
                      <div className="space-y-1 lg:space-y-2 max-h-24 lg:max-h-32 overflow-y-auto">
                        <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                          <span className="font-medium">BASE RATE</span>
                          <span className="font-semibold">
                            ${selectedOrder.rate.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                          <span className="font-medium">TOKEN</span>
                          <span className="font-semibold">
                            ${selectedOrder.token.toFixed(2)}
                          </span>
                        </div>
                        {selectedOrder.custwash && (
                          <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                            <span className="font-medium">CUSTOM WASH</span>
                            <span className="font-semibold">
                              ${selectedOrder.custwash.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.merc > 0 && (
                          <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                            <span className="font-medium">MERC</span>
                            <span className="font-semibold">
                              ${selectedOrder.merc.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.extra > 0 && (
                          <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                            <span className="font-medium">EXTRA</span>
                            <span className="font-semibold">
                              ${selectedOrder.extra.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.vat > 0 && (
                          <div className="flex justify-between items-center text-xs lg:text-sm bg-white border border-gray-200 rounded p-2 lg:p-3">
                            <span className="font-medium">VAT</span>
                            <span className="font-semibold">
                              ${selectedOrder.vat.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Actions */}
                    {getRemainingAmount(selectedOrder) > 0 && (
                      <div className="bg-green-50 rounded-lg p-3 lg:p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">
                          UPDATE PAYMENT
                        </h4>
                        <div className="space-y-3 lg:space-y-4">
                          <div>
                            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
                              PAYMENT AMOUNT
                            </label>
                            <input
                              type="number"
                              placeholder="Enter payment amount"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              min="0"
                              step="0.01"
                              max={getRemainingAmount(selectedOrder)}
                              className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base lg:text-lg"
                            />
                          </div>

                          <button
                            onClick={handlePartialPayment}
                            disabled={!paymentAmount || paymentAmount <= 0 || isProcessingPayment}
                            className="w-full px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold flex items-center justify-center gap-2 text-sm lg:text-base"
                          >
                            {isProcessingPayment ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-2 border-white border-t-transparent"></div>
                                PROCESSING...
                              </>
                            ) : (
                              "ADD PAYMENT"
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {getRemainingAmount(selectedOrder) === 0 && (
                      <div className="bg-green-100 rounded-lg p-3 lg:p-4 text-center">
                        <div className="text-2xl lg:text-4xl mb-2">✅</div>
                        <h4 className="font-semibold text-green-800 text-sm lg:text-base">
                          PAYMENT COMPLETE
                        </h4>
                        <p className="text-green-700 text-xs lg:text-sm">
                          THIS ORDER HAS BEEN FULLY PAID
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center h-full min-h-[300px] lg:min-h-[400px]">
                  <div className="text-center p-4">
                    <div className="text-4xl lg:text-6xl mb-4">💳</div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-2">
                      SELECT AN ORDER
                    </h3>
                    <p className="text-gray-500 text-xs lg:text-sm px-4">
                      CHOOSE AN ORDER FROM THE LIST TO VIEW PAYMENT DETAILS AND PROCESS PAYMENTS
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

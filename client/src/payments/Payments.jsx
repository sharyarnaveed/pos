import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";
import api from "../api";

const Payments = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
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
      console.log(responce.data);
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
    console.log(`Adding ${paymentAmount} to order ${selectedOrder.id}`);

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
      console.log(responce.data);
    } catch (error) {
      log.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.", {
        duration: 3000,
      });
    }

    setPaymentAmount("");
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.containerNumber
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      order["CustomerDetails.customername"]
        .toLowerCase()
        .includes(filters.searchQuery.toLowerCase()) ||
      order["CustomerDetails.phoneno"].toString().includes(filters.searchQuery);

    const matchesStatus =
      filters.paymentStatus === "all" ||
      getPaymentStatus(order) === filters.paymentStatus;

    const matchesDate =
      (!filters.startDate ||
        new Date(order.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(order.createdAt) <= new Date(filters.endDate));

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
            <h1 className="text-lg font-semibold text-gray-900">Payments</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-3 lg:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Payment Management
            </h1>
            <p className="text-gray-600">
              Manage order payments and tracking efficiently
            </p>
          </div>
          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Search & Filter Orders
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by order number, customer..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      setFilters({ ...filters, searchQuery: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  Payment Status
                </label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentStatus: e.target.value })
                  }
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Fully Paid</option>
                  <option value="partial">Partially Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                    className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Orders
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {filteredOrders.length}
                  </div>
                </div>
                <div className="text-2xl opacity-80">📋</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 font-medium">
                    Fully Paid
                  </div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "paid"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-2xl opacity-80">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 font-medium">
                    Partially Paid
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "partial"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-2xl opacity-80">⏳</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 font-medium">
                    Unpaid
                  </div>
                  <div className="text-2xl font-bold text-red-600 mt-1">
                    {
                      filteredOrders.filter(
                        (order) => getPaymentStatus(order) === "unpaid"
                      ).length
                    }
                  </div>
                </div>
                <div className="text-2xl opacity-80">❌</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="overflow-y-auto xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 lg:p-6">
                <div className="space-y-3 max-h-[600px] ">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        selectedOrder?.id === order.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            {order.containerNumber}
                          </h4>
                          <p className="text-gray-600 font-medium">
                            {order["CustomerDetails.customername"]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order["CustomerDetails.phoneno"]}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.from} → {order.to}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                              getPaymentStatus(order)
                            )}`}
                          >
                            {getPaymentStatus(order).toUpperCase()}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            Total
                          </span>
                          <span className="font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            Paid
                          </span>
                          <span className="font-bold text-green-600">
                            ${(order.paidamount || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-gray-500 text-xs">
                            Due
                          </span>
                          <span className="font-bold text-red-600">
                            ${getRemainingAmount(order).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your search filters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Details Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {selectedOrder ? (
                <>
                  <div className="p-4 lg:p-6 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Container Number:
                          </span>
                          <span className="font-semibold">
                            {selectedOrder.containerNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Customer:</span>
                          <span className="font-semibold">
                            {selectedOrder["CustomerDetails.customername"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>
                            {selectedOrder["CustomerDetails.phoneno"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Route:</span>
                          <span>
                            {selectedOrder.from} → {selectedOrder.to}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Driver:</span>
                          <span>
                            {selectedOrder["driverDetails.drivername"]}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span>
                            {selectedOrder["vehicleDetails.plateNumber"]} (
                            {selectedOrder["vehicleDetails.type"]})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span>
                            {new Date(selectedOrder.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Payment Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-bold text-gray-900">
                            ${selectedOrder.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg">
                          <span className="text-gray-600">Paid Amount:</span>
                          <span className="font-bold text-green-600">
                            ${(selectedOrder.paidamount || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 pt-3">
                          <div className="flex justify-between text-xl">
                            <span className="font-semibold text-gray-700">
                              Outstanding:
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
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Cost Breakdown
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
                          <span className="font-medium">Base Rate</span>
                          <span className="font-semibold">
                            ${selectedOrder.rate.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
                          <span className="font-medium">Token</span>
                          <span className="font-semibold">
                            ${selectedOrder.token.toFixed(2)}
                          </span>
                        </div>
                        {selectedOrder.custwash && (
                          <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
                            <span className="font-medium">Custom Wash</span>
                            <span className="font-semibold">
                              ${selectedOrder.custwash.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.merc > 0 && (
                          <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
                            <span className="font-medium">Merc</span>
                            <span className="font-semibold">
                              ${selectedOrder.merc.toFixed(2)}
                            </span>
                          </div>
                        )}
                        {selectedOrder.extra > 0 && (
                          <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
                            <span className="font-medium">Extra</span>
                            <span className="font-semibold">
                              ${selectedOrder.extra.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {selectedOrder.extra > 0 && (
                          <div className="flex justify-between items-center text-sm bg-white border border-gray-200 rounded p-3">
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
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Update Payment
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Amount
                            </label>
                            <input
                              type="number"
                              placeholder="Enter payment amount"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              min="0"
                              step="0.01"
                              max={getRemainingAmount(selectedOrder)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-lg"
                            />
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={handlePartialPayment}
                              disabled={!paymentAmount || paymentAmount <= 0}
                              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold"
                            >
                              Add Payment
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {getRemainingAmount(selectedOrder) === 0 && (
                      <div className="bg-green-100 rounded-lg p-4 text-center">
                        <div className="text-4xl mb-2">✅</div>
                        <h4 className="font-semibold text-green-800">
                          Payment Complete
                        </h4>
                        <p className="text-green-700 text-sm">
                          This order has been fully paid
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💳</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Select an Order
                    </h3>
                    <p className="text-gray-500 text-sm px-4">
                      Choose an order from the list to view payment details and
                      process payments
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

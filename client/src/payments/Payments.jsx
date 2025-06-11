import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Payments = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
    paymentStatus: 'all'
  });

  // Sample orders data - replace with actual data from your API
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerPhone: '+1234567890',
      totalAmount: 150.00,
      paidAmount: 100.00,
      createdAt: '2025-06-10T10:30:00',
      items: [
        { name: 'Product A', quantity: 2, price: 50.00 },
        { name: 'Product B', quantity: 1, price: 50.00 }
      ]
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      customerPhone: '+1234567891',
      totalAmount: 200.00,
      paidAmount: 200.00,
      createdAt: '2025-06-09T14:15:00',
      items: [
        { name: 'Product C', quantity: 1, price: 100.00 },
        { name: 'Product D', quantity: 2, price: 50.00 }
      ]
    }
  ];

  const getPaymentStatus = (order) => {
    const paidAmount = order.paidAmount || 0;
    const totalAmount = order.totalAmount;
    
    if (paidAmount >= totalAmount) return 'paid';
    if (paidAmount > 0) return 'partial';
    return 'unpaid';
  };

  const getRemainingAmount = (order) => {
    return Math.max(0, order.totalAmount - (order.paidAmount || 0));
  };

  const getStatusColor = (status) => {
    switch(status) {
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

  const handleMarkAsPaid = () => {
    // Logic to mark order as completely paid
    console.log(`Marking order ${selectedOrder.id} as paid`);
  };

  const handlePartialPayment = () => {
    // Logic to add partial payment
    console.log(`Adding ${paymentAmount} to order ${selectedOrder.id}`);
    setPaymentAmount('');
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      customerName: '',
      paymentStatus: 'all'
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div className={`flex-1 ${isSidebarCollapsed ? "ml-16" : "ml-64"} transition-all duration-300`}>
        {/* Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black">Payment Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage order payments and tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Filters Section */}
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-black mb-6">Filter Orders</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Customer Name</label>
                <input
                  type="text"
                  placeholder="Search by customer name"
                  value={filters.customerName}
                  onChange={(e) => setFilters({...filters, customerName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-2">Payment Status</label>
                <select
                  value={filters.paymentStatus}
                  onChange={(e) => setFilters({...filters, paymentStatus: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partially Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={handleClearFilters}
                  className="w-full px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-2xl font-bold text-black mt-2">{orders.length}</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Fully Paid</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {orders.filter(order => getPaymentStatus(order) === 'paid').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Partially Paid</div>
              <div className="text-2xl font-bold text-yellow-600 mt-2">
                {orders.filter(order => getPaymentStatus(order) === 'partial').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Unpaid</div>
              <div className="text-2xl font-bold text-red-600 mt-2">
                {orders.filter(order => getPaymentStatus(order) === 'unpaid').length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders List */}
            <div className="bg-white border border-gray-200">
              <div className="bg-black text-white p-6">
                <h3 className="text-lg font-semibold">Orders</h3>
              </div>
              
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className={`p-4 border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedOrder?.id === order.id ? 'border-black bg-gray-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-black">{order.orderNumber}</h4>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getPaymentStatus(order))}`}>
                        {getPaymentStatus(order).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="text-black font-medium">${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid:</span>
                        <span className="text-black font-medium">${(order.paidAmount || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="text-red-600 font-medium">${getRemainingAmount(order).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="text-black">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details & Payment Update */}
            <div className="bg-white border border-gray-200">
              {selectedOrder ? (
                <>
                  <div className="bg-black text-white p-6">
                    <h3 className="text-lg font-semibold">Order Details - {selectedOrder.orderNumber}</h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Customer Information */}
                    <div>
                      <h4 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">
                        Customer Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="text-black font-medium">{selectedOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="text-black">{selectedOrder.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="text-black">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">
                        Order Items
                      </h4>
                      <div className="space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-3">
                            <span className="text-black font-medium">{item.name}</span>
                            <div className="flex gap-4 text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              <span className="text-black font-medium">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div>
                      <h4 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">
                        Payment Summary
                      </h4>
                      <div className="bg-gray-50 p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="text-black font-semibold">${selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Paid Amount:</span>
                          <span className="text-green-600 font-semibold">${(selectedOrder.paidAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <span className="text-gray-600 font-medium">Remaining:</span>
                          <span className="text-red-600 font-bold">${getRemainingAmount(selectedOrder).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Actions */}
                    <div>
                      <h4 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">
                        Update Payment
                      </h4>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <input
                            type="number"
                            placeholder="Enter payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            min="0"
                            step="0.01"
                            className="flex-1 px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                          />
                          <button 
                            onClick={handlePartialPayment}
                            disabled={!paymentAmount || paymentAmount <= 0}
                            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            Add Payment
                          </button>
                        </div>
                        
                        <button 
                          onClick={handleMarkAsPaid}
                          disabled={getRemainingAmount(selectedOrder) === 0}
                          className="w-full px-4 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Mark as Completely Paid
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-600">Select an order to view details and update payment</p>
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
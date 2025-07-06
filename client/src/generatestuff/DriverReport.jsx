import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const DriverReport = ({ driverId }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriverReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api(`/api/user/driverreport/${driverId}`);
      
      
      if (response.data.success) {
        setReportData(response.data.OrderData);
      } else {
        setError('Failed to fetch driver report');
      }
    } catch (err) {
      console.error('Error loading driver report:', err);
      setError('Error loading driver report');
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    if (driverId) {
      fetchDriverReport();
    }
  }, [fetchDriverReport]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `AED ${amount.toFixed(2)}`;
  };

  const calculateTotals = () => {
    if (!reportData) return { totalOrders: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 };
    
    return reportData.reduce((acc, order) => ({
      totalOrders: acc.totalOrders + 1,
      totalAmount: acc.totalAmount + order.total,
      totalPaid: acc.totalPaid + order.paidamount,
      totalPending: acc.totalPending + (order.total - order.paidamount)
    }), { totalOrders: 0, totalAmount: 0, totalPaid: 0, totalPending: 0 });
  };

  const getPaymentStatus = (order) => {
    if (order.paidamount >= order.total) return 'Paid';
    if (order.paidamount > 0) return 'Partial';
    return 'Unpaid';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading driver report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 text-lg font-medium">{error}</div>
            <button 
              onClick={fetchDriverReport}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!reportData || reportData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-600 text-lg">No orders found for this driver</div>
          </div>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();
  // Fix: Access driver details using dot notation from API response
  const driverInfo = reportData[0] ? {
    id: reportData[0]['driverDetails.id'],
    drivername: reportData[0]['driverDetails.drivername'],
    driverphoneno: reportData[0]['driverDetails.driverphoneno']
  } : null;

  if (!driverInfo) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <div className="text-yellow-600 text-lg">Driver information is missing from the report data</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Driver Profile Header */}
        <div className="bg-gradient-to-r bg-black rounded-xl shadow-lg text-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">

              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">{driverInfo.drivername || 'Unknown Driver'}</h1>
                <p className="text-blue-100 text-lg">Professional Driver</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-blue-100">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {driverInfo.driverphoneno || 'N/A'}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0v1m4-1v1" />
                    </svg>
                    ID: {driverInfo.id || driverId}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totals.totalOrders}</div>
              <div className="text-blue-100">Total Deliveries</div>
              <div className="mt-2 text-sm text-blue-100">
                Performance Report
              </div>
            </div>
          </div>
        </div>

        {/* Driver Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Completed Trips</h3>
            <span className="text-3xl font-bold text-blue-600">{totals.totalOrders}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Revenue Generated</h3>
            <span className="text-3xl font-bold text-green-600">{formatCurrency(totals.totalAmount)}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Collected</h3>
            <span className="text-3xl font-bold text-emerald-600">{formatCurrency(totals.totalPaid)}</span>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Pending Collection</h3>
            <span className="text-3xl font-bold text-orange-600">{formatCurrency(totals.totalPending)}</span>
          </div>
        </div>

        {/* Driver Trip History */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-6 bg-blue-600 rounded-full mr-3"></div>
              Driver Trip History
              <span className="ml-3 text-sm text-gray-500 font-normal">({totals.totalOrders} total trips)</span>
            </h3>
          </div>
          
          {reportData.map((order, index) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
              {/* Trip Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full text-sm font-bold">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Trip #{order.id}</h4>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      order.type === 'import' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {order.type.toUpperCase()} TRIP
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      getPaymentStatus(order) === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : getPaymentStatus(order) === 'Partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getPaymentStatus(order)} PAYMENT
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Route & Delivery Info */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Route Information
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <span className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Pickup
                        </span>
                        <span className="font-semibold text-red-700 capitalize">{order.from}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="w-full border-t border-dashed border-gray-300 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white px-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <span className="text-sm text-gray-600 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Delivery
                        </span>
                        <span className="font-semibold text-green-700 capitalize">{order.to}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Container ID</span>
                        <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">{order.containerNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client & Vehicle Details */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Trip Details
                    </h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Client
                        </div>
                        <div className="font-semibold text-blue-800">{order['CustomerDetails.customername']}</div>
                        <div className="text-xs text-blue-600 mt-1">{order['CustomerDetails.companyname']}</div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Vehicle Used
                        </div>
                        <div className="font-semibold text-indigo-800">{order['vehicleDetails.plateNumber']}</div>
                        <div className="text-xs text-indigo-600 mt-1">{order['vehicleDetails.type']} • {order['vehicleDetails.fuelType']}</div>
                      </div>
                    </div>
                  </div>

                  {/* Driver Earnings */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Trip Earnings
                    </h5>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Base Rate</div>
                          <div className="font-semibold text-gray-800">{formatCurrency(order.rate)}</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Token</div>
                          <div className="font-semibold text-gray-800">{formatCurrency(order.token)}</div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-green-700">Trip Total</span>
                          <span className="text-lg font-bold text-green-800">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-green-600">Collected</span>
                          <span className="text-sm font-semibold text-green-700">{formatCurrency(order.paidamount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-red-600">Outstanding</span>
                          <span className="text-sm font-semibold text-red-700">{formatCurrency(order.total - order.paidamount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Trip Details */}
                {(order.remarks || order.merc > 0 || order.extra > 0 || order.vat > 0) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Additional Trip Information
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {order.merc > 0 && (
                        <div className="text-center p-2 bg-amber-50 rounded border border-amber-200">
                          <div className="text-xs text-amber-600">Merchandise</div>
                          <div className="font-semibold text-amber-800">{formatCurrency(order.merc)}</div>
                        </div>
                      )}
                      {order.extra > 0 && (
                        <div className="text-center p-2 bg-orange-50 rounded border border-orange-200">
                          <div className="text-xs text-orange-600">Extra Charges</div>
                          <div className="font-semibold text-orange-800">{formatCurrency(order.extra)}</div>
                        </div>
                      )}
                      {order.vat > 0 && (
                        <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                          <div className="text-xs text-purple-600">VAT</div>
                          <div className="font-semibold text-purple-800">{formatCurrency(order.vat)}</div>
                        </div>
                      )}
                      {order.remarks && (
                        <div className="sm:col-span-2 lg:col-span-1 p-2 bg-gray-50 rounded border border-gray-200">
                          <div className="text-xs text-gray-600">Trip Notes</div>
                          <div className="text-sm text-gray-800 truncate" title={order.remarks}>{order.remarks}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Driver Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <div className="w-2 h-6 bg-green-600 rounded-full mr-3"></div>
            <h3 className="text-xl font-semibold text-gray-900">Driver Performance Overview</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Driver Statistics */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
                Trip Statistics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-800">{totals.totalOrders}</div>
                  <div className="text-sm text-blue-600 mt-1">Completed Trips</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <div className="text-2xl font-bold text-indigo-800">{formatCurrency(totals.totalAmount)}</div>
                  <div className="text-sm text-indigo-600 mt-1">Total Revenue</div>
                </div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-800">
                  {totals.totalOrders > 0 ? formatCurrency(totals.totalAmount / totals.totalOrders) : formatCurrency(0)}
                </div>
                <div className="text-sm text-emerald-600 mt-1">Average Trip Value</div>
              </div>
            </div>

            {/* Payment Collection Performance */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Collection Performance
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-green-700">Amount Collected</span>
                  </div>
                  <span className="text-lg font-bold text-green-800">{formatCurrency(totals.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                    <span className="text-sm font-medium text-red-700">Outstanding Amount</span>
                  </div>
                  <span className="text-lg font-bold text-red-800">{formatCurrency(totals.totalPending)}</span>
                </div>
                <div className="mt-4 bg-gray-100 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 relative"
                    style={{ width: `${totals.totalAmount > 0 ? (totals.totalPaid / totals.totalAmount) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {totals.totalAmount > 0 ? Math.round((totals.totalPaid / totals.totalAmount) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Collection Efficiency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverReport;
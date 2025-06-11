import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Filter = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Sample data for customers
  const customers = [
    { id: 1, name: "ABC Corporation", email: "contact@abc.com", phone: "+1-555-0101", address: "123 Business St, NY" },
    { id: 2, name: "XYZ Industries", email: "info@xyz.com", phone: "+1-555-0102", address: "456 Industrial Ave, CA" },
    { id: 3, name: "Tech Solutions Ltd", email: "hello@techsol.com", phone: "+1-555-0103", address: "789 Tech Park, TX" },
    { id: 4, name: "Global Enterprises", email: "contact@global.com", phone: "+1-555-0104", address: "321 Global Plaza, FL" },
    { id: 5, name: "Metro Services", email: "info@metro.com", phone: "+1-555-0105", address: "654 Metro Center, WA" }
  ]

  // Sample invoice numbers
  const invoiceNumbers = [
    "INV-2025-001", "INV-2025-002", "INV-2025-003", "INV-2025-004", "INV-2025-005"
  ]

  // Sample filtered results - customer focused data
  const filteredData = [
    { 
      id: 1, 
      invoiceNumber: "INV-2025-001",
      customer: customers[0], 
      date: "2025-01-11", 
      amount: "$1,250.00", 
      status: "Paid",
      items: [
        { name: "Product A", quantity: 2, price: "$500.00" },
        { name: "Product B", quantity: 1, price: "$250.00" }
      ],
      paymentMethod: "Credit Card",
      notes: "Urgent delivery requested"
    },
    { 
      id: 2, 
      invoiceNumber: "INV-2025-002",
      customer: customers[1], 
      date: "2025-01-11", 
      amount: "$890.00", 
      status: "Pending",
      items: [
        { name: "Service A", quantity: 1, price: "$890.00" }
      ],
      paymentMethod: "Bank Transfer",
      notes: "Net 30 payment terms"
    },
    { 
      id: 3, 
      invoiceNumber: "INV-2025-003",
      customer: customers[2], 
      date: "2025-01-10", 
      amount: "$2,100.00", 
      status: "Paid",
      items: [
        { name: "Product C", quantity: 3, price: "$600.00" },
        { name: "Product D", quantity: 2, price: "$300.00" }
      ],
      paymentMethod: "Cash",
      notes: "Bulk order discount applied"
    },
    { 
      id: 4, 
      invoiceNumber: "INV-2025-004",
      customer: customers[3], 
      date: "2025-01-10", 
      amount: "$1,450.00", 
      status: "Overdue",
      items: [
        { name: "Service B", quantity: 2, price: "$725.00" }
      ],
      paymentMethod: "Check",
      notes: "Follow up required"
    },
    { 
      id: 5, 
      invoiceNumber: "INV-2025-005",
      customer: customers[4], 
      date: "2025-01-09", 
      amount: "$1,680.00", 
      status: "Paid",
      items: [
        { name: "Product E", quantity: 1, price: "$1,680.00" }
      ],
      paymentMethod: "Credit Card",
      notes: "Premium customer"
    }
  ]

  const handleApplyFilter = () => {
    console.log("Applying filters...", {
      customer: selectedCustomer,
      invoiceNumber: selectedInvoiceNumber,
      status: selectedStatus,
      fromDate,
      toDate
    })
  }

  const handleClearFilters = () => {
    setSelectedCustomer('')
    setSelectedInvoiceNumber('')
    setSelectedStatus('')
    setFromDate('')
    setToDate('')
  }

  const handleViewDetails = (record) => {
    setSelectedRecord(record)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setShowDetailModal(false)
    setSelectedRecord(null)
  }

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
                <h1 className="text-2xl font-bold text-black">Customer Invoices</h1>
                <p className="text-gray-600 text-sm mt-1">Filter and manage customer invoices</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={handleApplyFilter}
                  className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Filter Section */}
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-black mb-6">Filter Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Customer Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Customer
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Invoice Number Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Invoice Number
                </label>
                <select
                  value={selectedInvoiceNumber}
                  onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Invoice</option>
                  {invoiceNumbers.map((invoice) => (
                    <option key={invoice} value={invoice}>
                      {invoice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Results Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Invoices</div>
              <div className="text-2xl font-bold text-black mt-2">{filteredData.length}</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Paid</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {filteredData.filter(item => item.status === 'Paid').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600 mt-2">
                {filteredData.filter(item => item.status === 'Pending').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-black mt-2">$7,370.00</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-white border border-gray-200">
            {/* Table Header */}
            <div className="bg-black text-white">
              <div className="grid grid-cols-7 gap-4 px-6 py-4 text-sm font-medium">
                <div>Invoice #</div>
                <div>Customer</div>
                <div>Email</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredData.map((record) => (
                <div key={record.id} className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                     onClick={() => handleViewDetails(record)}>
                  <div className="font-medium text-blue-600">{record.invoiceNumber}</div>
                  <div className="font-medium text-black">{record.customer.name}</div>
                  <div className="text-gray-600">{record.customer.email}</div>
                  <div className="text-gray-600">{record.date}</div>
                  <div className="font-medium text-black">{record.amount}</div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        record.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => handleViewDetails(record)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="px-4 py-2 text-sm border border-gray-300 text-gray-500 cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 text-sm bg-black text-white">1</button>
            <button className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50">2</button>
            <button className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50">3</button>
            <button className="px-4 py-2 text-sm border border-gray-300 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Invoice Details</h2>
              <button 
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-black mb-2">Invoice Information</h3>
                  <p className="text-sm text-gray-600">Invoice #: <span className="font-medium text-black">{selectedRecord.invoiceNumber}</span></p>
                  <p className="text-sm text-gray-600">Date: <span className="font-medium text-black">{selectedRecord.date}</span></p>
                  <p className="text-sm text-gray-600">Amount: <span className="font-medium text-black">{selectedRecord.amount}</span></p>
                  <p className="text-sm text-gray-600">Payment Method: <span className="font-medium text-black">{selectedRecord.paymentMethod}</span></p>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedRecord.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : selectedRecord.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedRecord.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-black mb-2">Customer Information</h3>
                  <p className="text-sm text-gray-600">Name: <span className="font-medium text-black">{selectedRecord.customer.name}</span></p>
                  <p className="text-sm text-gray-600">Email: <span className="font-medium text-black">{selectedRecord.customer.email}</span></p>
                  <p className="text-sm text-gray-600">Phone: <span className="font-medium text-black">{selectedRecord.customer.phone}</span></p>
                  <p className="text-sm text-gray-600">Address: <span className="font-medium text-black">{selectedRecord.customer.address}</span></p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-3">Items</h3>
                <div className="border border-gray-200 rounded">
                  <div className="bg-gray-50 grid grid-cols-3 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
                    <div>Item</div>
                    <div>Quantity</div>
                    <div>Price</div>
                  </div>
                  {selectedRecord.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm border-t border-gray-200">
                      <div className="font-medium text-black">{item.name}</div>
                      <div className="text-gray-600">{item.quantity}</div>
                      <div className="text-gray-600">{item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div>
                  <h3 className="font-semibold text-black mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedRecord.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={closeDetailModal}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800">
                Edit Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Filter
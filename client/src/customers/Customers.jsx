import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Customers = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "ABC Corporation",
      email: "contact@abccorp.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business Ave, New York, NY 10001",
      totalOrders: 45,
      totalAmount: "$12,450.00",
      status: "Active",
      joinDate: "2024-01-15",
      lastOrder: "2025-01-10"
    },
    {
      id: 2,
      name: "XYZ Industries",
      email: "info@xyzind.com",
      phone: "+1 (555) 987-6543",
      address: "456 Industrial Blvd, Los Angeles, CA 90210",
      totalOrders: 32,
      totalAmount: "$8,920.00",
      status: "Active",
      joinDate: "2024-02-20",
      lastOrder: "2025-01-08"
    },
    {
      id: 3,
      name: "Tech Solutions Ltd",
      email: "hello@techsolutions.com",
      phone: "+1 (555) 456-7890",
      address: "789 Tech Park, Austin, TX 73301",
      totalOrders: 28,
      totalAmount: "$15,680.00",
      status: "Active",
      joinDate: "2024-03-10",
      lastOrder: "2025-01-09"
    },
    {
      id: 4,
      name: "Global Enterprises",
      email: "support@globalent.com",
      phone: "+1 (555) 321-0987",
      address: "321 Global Way, Chicago, IL 60601",
      totalOrders: 18,
      totalAmount: "$6,340.00",
      status: "Inactive",
      joinDate: "2024-04-05",
      lastOrder: "2024-12-15"
    },
    {
      id: 5,
      name: "Metro Services",
      email: "orders@metroservices.com",
      phone: "+1 (555) 654-3210",
      address: "654 Metro Center, Miami, FL 33101",
      totalOrders: 52,
      totalAmount: "$18,750.00",
      status: "Active",
      joinDate: "2024-01-25",
      lastOrder: "2025-01-11"
    }
  ])

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'Active'
  })

  const handleAddCustomer = () => {
    // Add customer logic will be implemented here
  }

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetail(true)
  }

  return (
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
              className="bg-black text-white px-3 py-1 text-sm font-medium hover:bg-gray-800 transition-colors rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 bg-white">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black">Customers</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your customer database</p>
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

        <div className="p-3 lg:p-8">
          {/* Search and Stats */}
          <div className="mb-4 lg:mb-8">
            {/* Search Bar */}
            <div className="mb-4 lg:mb-6">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <div className="bg-white border border-gray-200 p-3 lg:p-6">
                <div className="text-xs lg:text-sm text-gray-600">Total Customers</div>
                <div className="text-lg lg:text-2xl font-bold text-black mt-1 lg:mt-2">5</div>
              </div>
              <div className="bg-white border border-gray-200 p-3 lg:p-6">
                <div className="text-xs lg:text-sm text-gray-600">Active Customers</div>
                <div className="text-lg lg:text-2xl font-bold text-green-600 mt-1 lg:mt-2">4</div>
              </div>
              <div className="bg-white border border-gray-200 p-3 lg:p-6">
                <div className="text-xs lg:text-sm text-gray-600">Total Orders</div>
                <div className="text-lg lg:text-2xl font-bold text-blue-600 mt-1 lg:mt-2">175</div>
              </div>
              <div className="bg-white border border-gray-200 p-3 lg:p-6">
                <div className="text-xs lg:text-sm text-gray-600">Total Revenue</div>
                <div className="text-lg lg:text-2xl font-bold text-black mt-1 lg:mt-2">$62,140</div>
              </div>
            </div>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => handleCustomerClick(customer)}
                className="bg-white border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
              >
                <div className="flex justify-between items-start mb-3 lg:mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-lg font-semibold text-black truncate">{customer.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{customer.email}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3 lg:mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="text-black truncate ml-2">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orders:</span>
                    <span className="text-black font-medium">{customer.totalOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-black font-medium">{customer.totalAmount}</span>
                  </div>
                </div>

                <div className="pt-3 lg:pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Joined: {customer.joinDate}</span>
                    <span>Last: {customer.lastOrder || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 lg:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-black">Add New Customer</h2>
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
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Address
                </label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm h-20 resize-none"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Status
                </label>
                <select
                  value={newCustomer.status}
                  onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                onClick={handleAddCustomer}
                className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg lg:text-xl font-bold text-black">Customer Details</h2>
              <button
                onClick={() => setShowCustomerDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2">
                  Basic Information
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer Name</label>
                  <p className="text-black font-medium">{selectedCustomer.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-black break-all">{selectedCustomer.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-black">{selectedCustomer.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <span
                    className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                      selectedCustomer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedCustomer.status}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-black">{selectedCustomer.address}</p>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2">
                  Order Statistics
                </h3>

                <div className="bg-gray-50 p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="text-black font-medium">{selectedCustomer.totalOrders}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="text-black font-medium">{selectedCustomer.totalAmount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Join Date:</span>
                    <span className="text-black">{selectedCustomer.joinDate}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Last Order:</span>
                    <span className="text-black">{selectedCustomer.lastOrder || 'No orders yet'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-black">Quick Actions</h4>
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors">
                      Create New Order
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      View Order History
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      Generate Detail Invoice
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      Generate Overview Invoice
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                      Edit Customer
                    </button>
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
  )
}

export default Customers
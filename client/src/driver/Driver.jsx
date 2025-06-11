import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Driver = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [showDriverDetail, setShowDriverDetail] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample drivers data
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      licenseNumber: "DL123456789",
      address: "123 Main St, New York, NY 10001",
      vehicleAssigned: "ABC-1234",
      totalTrips: 145,
      totalEarnings: "$12,450.00",
      status: "Active",
      joinDate: "2024-01-15",
      lastTrip: "2025-01-11",
      rating: 4.8,
      experience: "5 years"
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 987-6543",
      licenseNumber: "DL987654321",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      vehicleAssigned: "DEF-5678",
      totalTrips: 98,
      totalEarnings: "$8,920.00",
      status: "Active",
      joinDate: "2024-02-20",
      lastTrip: "2025-01-10",
      rating: 4.6,
      experience: "3 years"
    },
    {
      id: 3,
      name: "David Brown",
      email: "david.brown@example.com",
      phone: "+1 (555) 456-7890",
      licenseNumber: "DL456789123",
      address: "789 Pine St, Austin, TX 73301",
      vehicleAssigned: "GHI-9012",
      totalTrips: 167,
      totalEarnings: "$15,680.00",
      status: "Active",
      joinDate: "2024-03-10",
      lastTrip: "2025-01-09",
      rating: 4.9,
      experience: "7 years"
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 (555) 321-0987",
      licenseNumber: "DL321098765",
      address: "321 Elm St, Chicago, IL 60601",
      vehicleAssigned: "JKL-3456",
      totalTrips: 45,
      totalEarnings: "$4,340.00",
      status: "Inactive",
      joinDate: "2024-04-05",
      lastTrip: "2024-12-15",
      rating: 4.3,
      experience: "2 years"
    },
    {
      id: 5,
      name: "James Davis",
      email: "james.davis@example.com",
      phone: "+1 (555) 654-3210",
      licenseNumber: "DL654321987",
      address: "654 Cedar Ave, Miami, FL 33101",
      vehicleAssigned: "MNO-7890",
      totalTrips: 201,
      totalEarnings: "$18,750.00",
      status: "Active",
      joinDate: "2024-01-25",
      lastTrip: "2025-01-11",
      rating: 4.7,
      experience: "6 years"
    }
  ])

  // New driver form state
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    address: '',
    vehicleAssigned: '',
    experience: '',
    status: 'Active'
  })

  const handleAddDriver = () => {
    // Add driver logic will be implemented here
    console.log("Adding driver:", newDriver)
  }

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
    setShowDriverDetail(true)
  }

  const getStatusColor = (status) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800"
  }

  const getRatingStars = (rating) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 ? "⭐" : "")
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
                <h1 className="text-2xl font-bold text-black">Drivers</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your driver database</p>
              </div>
              <button 
                onClick={() => setShowAddDriver(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Driver
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
                placeholder="Search drivers by name, license, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Total Drivers</div>
                <div className="text-2xl font-bold text-black mt-2">{drivers.length}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Active Drivers</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {drivers.filter(d => d.status === 'Active').length}
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Total Trips</div>
                <div className="text-2xl font-bold text-blue-600 mt-2">
                  {drivers.reduce((sum, d) => sum + d.totalTrips, 0)}
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Total Earnings</div>
                <div className="text-2xl font-bold text-black mt-2">$60,140.00</div>
              </div>
            </div>
          </div>

          {/* Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drivers.map((driver) => (
              <div
                key={driver.id}
                onClick={() => handleDriverClick(driver)}
                className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{driver.name}</h3>
                    <p className="text-sm text-gray-600">{driver.email}</p>
                    <p className="text-xs text-gray-500">License: {driver.licenseNumber}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="text-black font-medium">{driver.vehicleAssigned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Trips:</span>
                    <span className="text-black font-medium">{driver.totalTrips}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Earnings:</span>
                    <span className="text-black font-medium">{driver.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating:</span>
                    <span className="text-black">{getRatingStars(driver.rating)} ({driver.rating})</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Joined: {driver.joinDate}</span>
                    <span>Last Trip: {driver.lastTrip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Add New Driver</h2>
              <button
                onClick={() => setShowAddDriver(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter driver's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={newDriver.email}
                  onChange={(e) => setNewDriver({...newDriver, email: e.target.value})}
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
                  value={newDriver.phone}
                  onChange={(e) => setNewDriver({...newDriver, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  value={newDriver.licenseNumber}
                  onChange={(e) => setNewDriver({...newDriver, licenseNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter license number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Vehicle Assigned
                </label>
                <input
                  type="text"
                  value={newDriver.vehicleAssigned}
                  onChange={(e) => setNewDriver({...newDriver, vehicleAssigned: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="Enter vehicle number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={newDriver.experience}
                  onChange={(e) => setNewDriver({...newDriver, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="e.g., 5 years"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Address
                </label>
                <textarea
                  value={newDriver.address}
                  onChange={(e) => setNewDriver({...newDriver, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm h-20 resize-none"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Status
                </label>
                <select
                  value={newDriver.status}
                  onChange={(e) => setNewDriver({...newDriver, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddDriver(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDriver}
                className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Detail Modal */}
      {showDriverDetail && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Driver Details</h2>
              <button
                onClick={() => setShowDriverDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Personal Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Full Name</label>
                      <p className="text-black font-medium">{selectedDriver.name}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <p className="text-black">{selectedDriver.email}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-black">{selectedDriver.phone}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">License Number</label>
                      <p className="text-black font-mono">{selectedDriver.licenseNumber}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="text-black">{selectedDriver.address}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Experience</label>
                      <p className="text-black">{selectedDriver.experience}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(selectedDriver.status)}`}>
                        {selectedDriver.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information & Statistics */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Work Information
                  </h3>

                  <div className="bg-gray-50 p-4 space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Vehicle Assigned:</span>
                      <span className="text-black font-medium">{selectedDriver.vehicleAssigned}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Trips:</span>
                      <span className="text-black font-medium">{selectedDriver.totalTrips}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Earnings:</span>
                      <span className="text-black font-medium">{selectedDriver.totalEarnings}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating:</span>
                      <span className="text-black">{getRatingStars(selectedDriver.rating)} ({selectedDriver.rating}/5)</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Join Date:</span>
                      <span className="text-black">{selectedDriver.joinDate}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Trip:</span>
                      <span className="text-black">{selectedDriver.lastTrip}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-black">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 transition-colors">
                       Generate Driver Report
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        View Trip History
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        Edit Driver Info
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        Change Vehicle
                      </button>
                      <div className="pt-2 border-t border-gray-200">
                        <button className="w-full px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                          Deactivate Driver
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowDriverDetail(false)}
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

export default Driver
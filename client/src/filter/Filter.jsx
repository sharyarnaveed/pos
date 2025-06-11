import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Filter = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Sample data for dropdowns
  const drivers = [
    { id: 1, name: "John Smith" },
    { id: 2, name: "Mike Johnson" },
    { id: 3, name: "David Brown" },
    { id: 4, name: "Robert Wilson" },
    { id: 5, name: "James Davis" }
  ]

  const customers = [
    { id: 1, name: "ABC Corporation" },
    { id: 2, name: "XYZ Industries" },
    { id: 3, name: "Tech Solutions Ltd" },
    { id: 4, name: "Global Enterprises" },
    { id: 5, name: "Metro Services" }
  ]

  const vehicles = [
    { id: 1, number: "ABC-1234", type: "Truck" },
    { id: 2, number: "DEF-5678", type: "Van" },
    { id: 3, number: "GHI-9012", type: "Truck" },
    { id: 4, number: "JKL-3456", type: "Van" },
    { id: 5, number: "MNO-7890", type: "Truck" }
  ]

  // Sample filtered results
  const filteredData = [
    { id: 1, driver: "John Smith", customer: "ABC Corporation", vehicle: "ABC-1234", date: "2025-01-11", amount: "$1,250.00", status: "Completed" },
    { id: 2, driver: "Mike Johnson", customer: "XYZ Industries", vehicle: "DEF-5678", date: "2025-01-11", amount: "$890.00", status: "In Progress" },
    { id: 3, driver: "David Brown", customer: "Tech Solutions Ltd", vehicle: "GHI-9012", date: "2025-01-10", amount: "$2,100.00", status: "Completed" },
    { id: 4, driver: "Robert Wilson", customer: "Global Enterprises", vehicle: "JKL-3456", date: "2025-01-10", amount: "$1,450.00", status: "Pending" },
    { id: 5, driver: "James Davis", customer: "Metro Services", vehicle: "MNO-7890", date: "2025-01-09", amount: "$1,680.00", status: "Completed" }
  ]

  const handleApplyFilter = () => {
    // Filter logic will be implemented here
    console.log("Applying filters...", {
      driver: selectedDriver,
      customer: selectedCustomer,
      vehicle: selectedVehicle,
      fromDate,
      toDate
    })
  }

  const handleClearFilters = () => {
    setSelectedDriver('')
    setSelectedCustomer('')
    setSelectedVehicle('')
    setFromDate('')
    setToDate('')
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
                <h1 className="text-2xl font-bold text-black">Filter Records</h1>
                <p className="text-gray-600 text-sm mt-1">Filter and search your records</p>
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
              {/* Driver Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Driver Name
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.name}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Vehicle Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Vehicle
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.number}>
                      {vehicle.number} - {vehicle.type}
                    </option>
                  ))}
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
              <div className="text-sm text-gray-600">Total Results</div>
              <div className="text-2xl font-bold text-black mt-2">{filteredData.length}</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                {filteredData.filter(item => item.status === 'Completed').length}
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                {filteredData.filter(item => item.status === 'In Progress').length}
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
                <div>Driver</div>
                <div>Customer</div>
                <div>Vehicle</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredData.map((record) => (
                <div key={record.id} className="grid grid-cols-7 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-black">{record.driver}</div>
                  <div className="text-gray-600">{record.customer}</div>
                  <div className="text-gray-600">{record.vehicle}</div>
                  <div className="text-gray-600">{record.date}</div>
                  <div className="font-medium text-black">{record.amount}</div>
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        record.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : record.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
    </div>
  )
}

export default Filter
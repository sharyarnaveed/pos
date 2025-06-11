import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Vehcile = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Sample vehicles data
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      plateNumber: "ABC-1234",
      make: "Ford",
      model: "Transit",
      year: "2022",
      type: "Van",
      capacity: "3.5 tons",
      fuelType: "Diesel",
      color: "White",
      driverAssigned: "John Smith",
      totalTrips: 145,
      totalDistance: "12,450 km",
      status: "Active",
      lastMaintenance: "2024-12-15",
      nextMaintenance: "2025-03-15",
      registrationExpiry: "2025-06-30",
      insuranceExpiry: "2025-08-15"
    },
    {
      id: 2,
      plateNumber: "DEF-5678",
      make: "Mercedes",
      model: "Sprinter",
      year: "2021",
      type: "Van",
      capacity: "2.5 tons",
      fuelType: "Diesel",
      color: "Silver",
      driverAssigned: "Mike Johnson",
      totalTrips: 98,
      totalDistance: "8,920 km",
      status: "Active",
      lastMaintenance: "2024-11-20",
      nextMaintenance: "2025-02-20",
      registrationExpiry: "2025-05-15",
      insuranceExpiry: "2025-07-10"
    },
    {
      id: 3,
      plateNumber: "GHI-9012",
      make: "Isuzu",
      model: "NPR",
      year: "2023",
      type: "Truck",
      capacity: "5 tons",
      fuelType: "Diesel",
      color: "Blue",
      driverAssigned: "David Brown",
      totalTrips: 167,
      totalDistance: "15,680 km",
      status: "Active",
      lastMaintenance: "2025-01-05",
      nextMaintenance: "2025-04-05",
      registrationExpiry: "2025-12-30",
      insuranceExpiry: "2025-10-20"
    },
    {
      id: 4,
      plateNumber: "JKL-3456",
      make: "Toyota",
      model: "Hiace",
      year: "2020",
      type: "Van",
      capacity: "1.5 tons",
      fuelType: "Petrol",
      color: "Red",
      driverAssigned: "Robert Wilson",
      totalTrips: 45,
      totalDistance: "4,340 km",
      status: "Maintenance",
      lastMaintenance: "2024-12-01",
      nextMaintenance: "2025-01-15",
      registrationExpiry: "2025-04-20",
      insuranceExpiry: "2025-06-05"
    },
    {
      id: 5,
      plateNumber: "MNO-7890",
      make: "Mitsubishi",
      model: "Canter",
      year: "2022",
      type: "Truck",
      capacity: "4 tons",
      fuelType: "Diesel",
      color: "Black",
      driverAssigned: "James Davis",
      totalTrips: 201,
      totalDistance: "18,750 km",
      status: "Active",
      lastMaintenance: "2024-12-10",
      nextMaintenance: "2025-03-10",
      registrationExpiry: "2025-11-15",
      insuranceExpiry: "2025-09-30"
    }
  ])

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    type: 'Van',
    capacity: '',
    fuelType: 'Diesel',
    color: '',
    driverAssigned: '',
    status: 'Active'
  })

  const handleAddVehicle = () => {
    // Add vehicle logic will be implemented here
    console.log("Adding vehicle:", newVehicle)
  }

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetail(true)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <h1 className="text-2xl font-bold text-black">Vehicles</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your vehicle fleet</p>
              </div>
              <button 
                onClick={() => setShowAddVehicle(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Vehicle
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
                placeholder="Search vehicles by plate number, make, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Total Vehicles</div>
                <div className="text-2xl font-bold text-black mt-2">{vehicles.length}</div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Active Vehicles</div>
                <div className="text-2xl font-bold text-green-600 mt-2">
                  {vehicles.filter(v => v.status === 'Active').length}
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">In Maintenance</div>
                <div className="text-2xl font-bold text-yellow-600 mt-2">
                  {vehicles.filter(v => v.status === 'Maintenance').length}
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-6">
                <div className="text-sm text-gray-600">Total Distance</div>
                <div className="text-2xl font-bold text-black mt-2">60,140 km</div>
              </div>
            </div>
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                onClick={() => handleVehicleClick(vehicle)}
                className="bg-white border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-gray-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-black">{vehicle.plateNumber}</h3>
                    <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                    <p className="text-xs text-gray-500">{vehicle.year} • {vehicle.type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Driver:</span>
                    <span className="text-black font-medium">{vehicle.driverAssigned}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="text-black font-medium">{vehicle.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Trips:</span>
                    <span className="text-black font-medium">{vehicle.totalTrips}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distance:</span>
                    <span className="text-black font-medium">{vehicle.totalDistance}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fuel: {vehicle.fuelType}</span>
                    <span>Color: {vehicle.color}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Plate Number *
                </label>
                <input
                  type="text"
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="e.g., ABC-1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Make *
                </label>
                <input
                  type="text"
                  value={newVehicle.make}
                  onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="e.g., Ford, Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="e.g., Transit, Hiace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                  placeholder="e.g., 2023"
                  min="1990"
                  max="2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Vehicle Type *
                </label>
                <select
                  value={newVehicle.type}
                  onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Car">Car</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Fuel Type
                </label>
                <select
                  value={newVehicle.fuelType}
                  onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
                >
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddVehicle(false)}
                className="flex-1 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                className="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Detail Modal */}
      {showVehicleDetail && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Vehicle Details</h2>
              <button
                onClick={() => setShowVehicleDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vehicle Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Vehicle Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Plate Number</label>
                      <p className="text-black font-medium font-mono">{selectedVehicle.plateNumber}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Make</label>
                        <p className="text-black">{selectedVehicle.make}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Model</label>
                        <p className="text-black">{selectedVehicle.model}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Year</label>
                        <p className="text-black">{selectedVehicle.year}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Type</label>
                        <p className="text-black">{selectedVehicle.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Color</label>
                        <p className="text-black">{selectedVehicle.color}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Capacity</label>
                        <p className="text-black">{selectedVehicle.capacity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fuel Type</label>
                        <p className="text-black">{selectedVehicle.fuelType}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned Driver</label>
                      <p className="text-black font-medium">{selectedVehicle.driverAssigned}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusColor(selectedVehicle.status)}`}>
                        {selectedVehicle.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Statistics & Maintenance */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                    Usage Statistics
                  </h3>

                  <div className="bg-gray-50 p-4 space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Trips:</span>
                      <span className="text-black font-medium">{selectedVehicle.totalTrips}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Distance:</span>
                      <span className="text-black font-medium">{selectedVehicle.totalDistance}</span>
                    </div>
                  </div>

                  <h4 className="text-md font-semibold text-black mb-3">Maintenance & Documents</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Maintenance:</span>
                      <span className="text-black">{selectedVehicle.lastMaintenance}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Next Maintenance:</span>
                      <span className="text-black font-medium">{selectedVehicle.nextMaintenance}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Registration Expiry:</span>
                      <span className="text-black">{selectedVehicle.registrationExpiry}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Insurance Expiry:</span>
                      <span className="text-black">{selectedVehicle.insuranceExpiry}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <h4 className="text-sm font-medium text-black">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        View Trip History
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        Generate Vehicle Report
                      </button>
                      <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                        Edit Vehicle Info
                      </button>
                      <div className="pt-2 border-t border-gray-200">
                        <button className="w-full px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                          Deactivate Vehicle
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowVehicleDetail(false)}
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

export default Vehcile
import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'

const Data = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const sampleData = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", address: "123 Main St, City", date: "2025-01-11" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", address: "456 Oak Ave, Town", date: "2025-01-11" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892", address: "789 Pine St, Village", date: "2025-01-10" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+1234567893", address: "321 Elm St, County", date: "2025-01-10" },
    { id: 5, name: "David Brown", email: "david@example.com", phone: "+1234567894", address: "654 Maple Ave, District", date: "2025-01-09" },
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+1234567890", address: "123 Main St, City", date: "2025-01-11" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", address: "456 Oak Ave, Town", date: "2025-01-11" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892", address: "789 Pine St, Village", date: "2025-01-10" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", phone: "+1234567893", address: "321 Elm St, County", date: "2025-01-10" },
    { id: 5, name: "David Brown", email: "david@example.com", phone: "+1234567894", address: "654 Maple Ave, District", date: "2025-01-09" },
  ]

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
                <h1 className="text-2xl font-bold text-black">Data Management</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your records</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Add New Record
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Total Records</div>
              <div className="text-2xl font-bold text-black mt-2">25</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">This Month</div>
              <div className="text-2xl font-bold text-black mt-2">12</div>
            </div>
            <div className="bg-white border border-gray-200 p-6">
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl font-bold text-black mt-2">23</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200">
            {/* Table Header */}
            <div className="bg-black text-white">
              <div className="grid grid-cols-6 gap-4 px-6 py-4 text-sm font-medium">
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Address</div>
                <div>Date</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {sampleData.map((record) => (
                <div key={record.id} className="grid grid-cols-6 gap-4 px-6 py-4 text-sm hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-black">{record.name}</div>
                  <div className="text-gray-600">{record.email}</div>
                  <div className="text-gray-600">{record.phone}</div>
                  <div className="text-gray-600 truncate">{record.address}</div>
                  <div className="text-gray-600">{record.date}</div>
                  <div>
                    <button 
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">Add New Record</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-gray-300 text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Modal Body */}
            <form className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Address
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:outline-none resize-none"
                    placeholder="Enter full address"
                  />
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-black text-white hover:bg-gray-800"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Data
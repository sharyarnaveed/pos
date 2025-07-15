import React from "react";

const AddExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
  handleSubmitExpense,
  registerExpense,
  expenseErrors,
  Vehicles,
  mechanics,
  selectedCategory,
  watchExpense,
  gallonsToLiters,
  fuelStations,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
        <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-base sm:text-lg font-medium">Add New Expense</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmitExpense(onSubmit)} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Description *</label>
              <input
                type="text"
                {...registerExpense("description", { required: "Description is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                placeholder="Enter expense description"
              />
              {expenseErrors.description && (
                <p className="text-red-500 text-xs mt-1">{expenseErrors.description.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Amount *</label>
              <input
                type="number"
                step="0.01"
                {...registerExpense("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Amount must be greater than 0" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                placeholder="0.00"
              />
              {expenseErrors.amount && (
                <p className="text-red-500 text-xs mt-1">{expenseErrors.amount.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Category *</label>
              <select
                {...registerExpense("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option value="Fuel">Fuel</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Fixed Costs">Fixed Costs</option>
                <option value="Marketing">Marketing</option>
                <option value="Utilities">Utilities</option>
                <option value="Insurance">Insurance</option>
                <option value="Other">Other</option>
              </select>
              {expenseErrors.category && (
                <p className="text-red-500 text-xs mt-1">{expenseErrors.category.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Vehicle *</label>
              <select
                {...registerExpense("vehicleId", { required: "Vehicle is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option value="">Select Vehicle</option>
                {Vehicles.map((item) => (
                  <option key={item.id} value={item.id} className="uppercase">
                    {item.plateNumber}
                  </option>
                ))}
              </select>
              {expenseErrors.vehicleId && (
                <p className="text-red-500 text-xs mt-1">{expenseErrors.vehicleId.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Date *</label>
              <input
                type="date"
                {...registerExpense("date", { required: "Date is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              />
              {expenseErrors.date && (
                <p className="text-red-500 text-xs mt-1">{expenseErrors.date.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">Remarks</label>
              <textarea
                {...registerExpense("remarks")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm resize-none uppercase"
                placeholder="Additional notes or remarks"
              />
            </div>
            {selectedCategory === "Maintenance" && (
              <>
                <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm">🔧</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Maintenance Details</h4>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Shop Name *</label>
                  <select
                    {...registerExpense("maintenanceShop", {
                      required: selectedCategory === "Maintenance" ? "Shop name is required for maintenance expenses" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                  >
                    <option value="">Select Maintenance Shop</option>
                    {mechanics.map((mechanic) => (
                      <option key={mechanic.id} value={mechanic.shopName} className="uppercase">
                        {mechanic.shopName}
                      </option>
                    ))}
                  </select>
                  {expenseErrors.maintenanceShop && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.maintenanceShop.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Bill Number *</label>
                  <input
                    type="text"
                    {...registerExpense("maintenanceBillNo", {
                      required: selectedCategory === "Maintenance" ? "Bill number is required for maintenance expenses" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Enter bill/invoice number"
                  />
                  {expenseErrors.maintenanceBillNo && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.maintenanceBillNo.message}</p>
                  )}
                </div>
              </>
            )}
            {selectedCategory === "Fuel" && (
              <>
                <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">⛽</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Fuel Details</h4>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Fuel Station *</label>
                  <select
                    {...registerExpense("fuelStation", {
                      required: selectedCategory === "Fuel" ? "Fuel station is required for fuel expenses" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                  >
                    <option value="">Select Fuel Station</option>
                    {fuelStations && fuelStations.map((station) => (
                      <option key={station.id} value={station.stationName} className="uppercase">
                        {station.stationName} {station.location ? `- ${station.location}` : ""}
                      </option>
                    ))}
                  </select>
                  {expenseErrors.fuelStation && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.fuelStation.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Bill/Invoice Number *</label>
                  <input
                    type="text"
                    {...registerExpense("billInvoice", {
                      required: selectedCategory === "Fuel" ? "Bill/Invoice number is required for fuel expenses" : false,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                    placeholder="Enter bill/invoice number"
                  />
                  {expenseErrors.billInvoice && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.billInvoice.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Quantity (Gallons) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      {...registerExpense("quantity", {
                        required: selectedCategory === "Fuel" ? "Quantity is required for fuel expenses" : false,
                        min: { value: 0.01, message: "Quantity must be greater than 0" },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm pr-12"
                      placeholder="0.00"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">Gal</span>
                  </div>
                  {watchExpense("quantity") && (
                    <div className="mt-1 text-xs text-blue-600">
                      ≈ {gallonsToLiters(watchExpense("quantity"))} Liters
                    </div>
                  )}
                  {expenseErrors.quantity && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.quantity.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Price per Gallon (AED) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">AED</span>
                    <input
                      type="number"
                      step="0.01"
                      {...registerExpense("dhs", {
                        required: selectedCategory === "Fuel" ? "Price per gallon is required for fuel expenses" : false,
                        min: { value: 0.01, message: "Price must be greater than 0" },
                      })}
                      className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  {expenseErrors.dhs && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.dhs.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Number of Fills *</label>
                  <input
                    type="number"
                    {...registerExpense("fills", {
                      required: selectedCategory === "Fuel" ? "Number of fills is required for fuel expenses" : false,
                      min: { value: 1, message: "Number of fills must be at least 1" },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                    placeholder="1"
                  />
                  {expenseErrors.fills && (
                    <p className="text-red-500 text-xs mt-1">{expenseErrors.fills.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">📊 Fuel Calculation Summary</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Total Quantity:</span>
                        <span className="font-medium text-blue-900 ml-2">{watchExpense("quantity") || "0"} Gal</span>
                        <div className="text-xs text-blue-600">(≈ {gallonsToLiters(watchExpense("quantity"))} L)</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Rate per Gallon:</span>
                        <span className="font-medium text-blue-900 ml-2">AED {watchExpense("dhs") || "0.00"}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Number of Fills:</span>
                        <span className="font-medium text-blue-900 ml-2">{watchExpense("fills") || "0"}</span>
                      </div>
                      <div>
                        <span className="text-blue-700">Calculated Total:</span>
                        <span className="font-bold text-blue-900 ml-2">
                          AED {((parseFloat(watchExpense("quantity")) || 0) * (parseFloat(watchExpense("dhs")) || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">💡 Tip: Enter quantity in gallons, price per gallon in AED</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm bg-black text-white hover:bg-gray-800 rounded-lg"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;

import React from "react";

const EditExpenseModal = ({
  isOpen,
  editingExpense,
  onClose,
  onSubmitEditExpense,
  handleSubmitEditExpense,
  registerEditExpense,
  editExpenseErrors,
  Vehicles,
  mechanics,
  selectedEditCategory,
  watchEditExpense,
  gallonsToLiters,
  fuelStations,
  drivers, // <-- Add this line
}) => {
  if (!isOpen || !editingExpense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
        {/* Modal Header */}
        <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-base sm:text-lg font-medium">Edit Expense</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmitEditExpense(onSubmitEditExpense)} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Description *
              </label>
              <input
                type="text"
                {...registerEditExpense("description", {
                  required: "Description is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                placeholder="Enter expense description"
              />
              {editExpenseErrors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                {...registerEditExpense("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                placeholder="0.00"
              />
              {editExpenseErrors.amount && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Category *
              </label>
              <select
                {...registerEditExpense("category", {
                  required: "Category is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              >
               <option value="">Select Category</option>
                <option value="Fuel">Fuel</option>
                <option value="Machanic Expense">Machanic Expense</option>
                <option value="Electriction exercise">Electriction exercise</option>
                <option value="Spare parts Expense">Spare parts Expense</option>
                <option value="Office Expense">Office Expense</option>
                <option value="Office rent">Office rent</option>
                <option value="Car petrol">Car petrol</option>
                <option value="Staff salary">Staff salary</option>
                <option value="Trade licence renewal">Trade licence renewal</option>
                <option value="DP world payment">DP world payment</option>
                <option value="Petty cash">Petty cash</option>
                <option value="Company road permit fee">Company road permit fee</option>
                <option value="Other Expense">Other Expense</option>
              </select>
              {editExpenseErrors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Vehicle
              </label>
              <select
                {...registerEditExpense("vehicleId", {
                  required: "Vehicle is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option value="">Select Vehicle</option>
                {Vehicles.map((item) => (
                  <option key={item.id} value={item.id} className="uppercase">
                    {item.plateNumber}
                  </option>
                ))}
              </select>
              {editExpenseErrors.vehicleId && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.vehicleId.message}
                </p>
              )}
            </div>
            {/* --- Add Driver Select --- */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Driver
              </label>
              <select
                {...registerEditExpense("driverId", {
                  required: false, // Set to true if driver is required
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              >
                <option value="">Select Driver</option>
                {drivers && drivers.length > 0
                  ? drivers.map((driver) => (
                      <option key={driver.id || driver._id} value={driver.id || driver._id}>
                       {driver.drivername}
                      </option>
                    ))
                  : null}
              </select>
              {editExpenseErrors.driverId && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.driverId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Date *
              </label>
              <input
                type="date"
                {...registerEditExpense("date", {
                  required: "Date is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
              />
              {editExpenseErrors.date && (
                <p className="text-red-500 text-xs mt-1">
                  {editExpenseErrors.date.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-black mb-2">
                Remarks
              </label>
              <textarea
                {...registerEditExpense("remarks")}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm resize-none uppercase"
                placeholder="Additional notes or remarks"
              />
            </div>
          </div>

          {/* Fuel-specific fields for Edit */}
          {selectedEditCategory === "Fuel" && (
            <>
              <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">⛽</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Fuel Details
                  </h4>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Fuel Station *
                </label>
                <select
                  {...registerEditExpense("fuelStation", {
                    required:
                      selectedEditCategory === "Fuel"
                        ? "Fuel station is required for fuel expenses"
                        : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                >
                  <option value="">Select Fuel Station</option>
                  {fuelStations && fuelStations.length > 0
                    ? fuelStations.map((station) => (
                        <option key={station.id || station._id || station.name} value={station.name} className="uppercase">
                          {station.stationName} {station.location ? `- ${station.location}` : ""}
                        </option>
                      ))
                    : null}
                </select>
                {editExpenseErrors.fuelStation && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.fuelStation.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Bill/Invoice Number *
                </label>
                <input
                  type="text"
                  {...registerEditExpense("billInvoice", {
                    required:
                      selectedEditCategory === "Fuel"
                        ? "Bill/Invoice number is required for fuel expenses"
                        : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                  placeholder="Enter bill/invoice number"
                />
                {editExpenseErrors.billInvoice && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.billInvoice.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Quantity (Gallons) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    {...registerEditExpense("quantity", {
                      required:
                        selectedEditCategory === "Fuel"
                          ? "Quantity is required for fuel expenses"
                          : false,
                      min: {
                        value: 0.01,
                        message: "Quantity must be greater than 0",
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm pr-12"
                    placeholder="0.00"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    Gal
                  </span>
                </div>
                {watchEditExpense("quantity") && (
                  <div className="mt-1 text-xs text-blue-600">
                    ≈ {gallonsToLiters(watchEditExpense("quantity"))} Liters
                  </div>
                )}
                {editExpenseErrors.quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.quantity.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Price per Gallon (AED) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    AED
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    {...registerEditExpense("dhs", {
                      required:
                        selectedEditCategory === "Fuel"
                          ? "Price per gallon is required for fuel expenses"
                          : false,
                      min: {
                        value: 0.01,
                        message: "Price must be greater than 0",
                      },
                    })}
                    className="w-full px-3 py-2 pl-12 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
                {editExpenseErrors.dhs && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.dhs.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Number of Fills *
                </label>
                <input
                  type="number"
                  {...registerEditExpense("fills", {
                    required:
                      selectedEditCategory === "Fuel"
                        ? "Number of fills is required for fuel expenses"
                        : false,
                    min: {
                      value: 1,
                      message: "Number of fills must be at least 1",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                  placeholder="1"
                />
                {editExpenseErrors.fills && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.fills.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-900 mb-2">
                    📊 Fuel Calculation Summary
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Quantity:</span>
                      <span className="font-medium text-blue-900 ml-2">
                        {watchEditExpense("quantity") || "0"} Gal
                      </span>
                      <div className="text-xs text-blue-600">
                        (≈ {gallonsToLiters(watchEditExpense("quantity"))} L)
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-700">Rate per Gallon:</span>
                      <span className="font-medium text-blue-900 ml-2">
                        AED {watchEditExpense("dhs") || "0.00"}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Number of Fills:</span>
                      <span className="font-medium text-blue-900 ml-2">
                        {watchEditExpense("fills") || "0"}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Calculated Total:</span>
                      <span className="font-bold text-blue-900 ml-2">
                        AED{" "}
                        {(
                          (parseFloat(watchEditExpense("quantity")) || 0) *
                          (parseFloat(watchEditExpense("dhs")) || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    💡 Tip: Enter quantity in gallons, price per gallon in AED
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Maintenance-specific fields for Edit */}
          {selectedEditCategory === "Machanic Expense" || selectedEditCategory === "Spare parts Expense"  && (
            <>
              <div className="sm:col-span-2 border-t border-gray-200 pt-6 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">🔧</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Maintenance Details
                  </h4>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Shop Name *
                </label>
                <select
                  {...registerEditExpense("maintenanceShop", {
                    required:
                      selectedEditCategory === "Maintenance"
                        ? "Shop name is required for maintenance expenses"
                        : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm"
                >
                  <option value="">Select Maintenance Shop</option>
                  {mechanics.map((mechanic) => (
                    <option
                      key={mechanic.id}
                      value={mechanic.shopName}
                      className="uppercase"
                    >
                      {mechanic.shopName}
                    </option>
                  ))}
                </select>
                {editExpenseErrors.maintenanceShop && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.maintenanceShop.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Bill Number *
                </label>
                <input
                  type="text"
                  {...registerEditExpense("maintenanceBillNo", {
                    required:
                      selectedEditCategory === "Maintenance"
                        ? "Bill number is required for maintenance expenses"
                        : false,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-black focus:outline-none text-sm uppercase"
                  placeholder="Enter bill/invoice number"
                />
                {editExpenseErrors.maintenanceBillNo && (
                  <p className="text-red-500 text-xs mt-1">
                    {editExpenseErrors.maintenanceBillNo.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-900 mb-2">
                    🔧 Maintenance Summary
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-yellow-700">Shop Name:</span>
                      <span className="font-medium text-yellow-900 ml-2">
                        {watchEditExpense("maintenanceShop") || "Not selected"}
                      </span>
                    </div>
                    <div>
                      <span className="text-yellow-700">Bill Number:</span>
                      <span className="font-medium text-yellow-900 ml-2">
                        {watchEditExpense("maintenanceBillNo") ||
                          "Not specified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-yellow-700">Total Cost:</span>
                      <span className="font-bold text-yellow-900 ml-2">
                        AED {watchEditExpense("amount") || "0.00"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-600">
                    🔧 Maintenance expense for vehicle repair/service
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Modal Footer */}
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
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
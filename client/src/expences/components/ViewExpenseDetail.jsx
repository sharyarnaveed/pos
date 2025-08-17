import React from "react";

const GALLON_TO_LITER = 3.78541;
const gallonsToLiters = (gallons) =>
  gallons ? (parseFloat(gallons) * GALLON_TO_LITER).toFixed(2) : "0.00";

const ViewExpenseDetail = ({ expense, onClose, onEdit }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full max-w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-lg m-2">
        <div className="bg-black text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-base sm:text-lg font-medium">Expense Details</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Expense Information */}
            <div>
              <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                Expense Information
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Description:</span>
                  <span className="font-medium text-sm break-words uppercase">
                    {expense.description ||
                      `${expense.category} for Vehicle ${expense["vehicleDetails.plateNumber"]}`}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Amount:</span>
                  <span className="font-bold text-red-600">
                    AED {expense.amount}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Category:</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 w-fit">
                    {expense.category.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Date:</span>
                  <span className="font-medium text-sm">
                    {expense.date.split("T")[0]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Type:</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 w-fit">
                    VEHICLE
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
                Vehicle Information
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Plate Number:</span>
                  <span className="font-medium text-sm uppercase">
                    {expense["vehicleDetails.plateNumber"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Type:</span>
                  <span className="font-medium text-sm uppercase">
                    {expense["vehicleDetails.type"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600 text-sm">Fuel Type:</span>
                  <span className="font-medium text-sm uppercase">
                    {expense["vehicleDetails.fuelType"]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
              Driver Information
            </h4>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Name:</span>
                <span className="font-medium text-sm uppercase">
                  {expense["driverdetails.drivername"]}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-gray-600 text-sm">Phone:</span>
                <span className="font-medium text-sm">
                  {expense["driverdetails.driverphoneno"]}
                </span>
              </div>
            </div>
          </div>

          {/* Fuel Details */}
          {expense.category === "Fuel" && (
            <div className="mt-6">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">⛽</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Fuel Details
                  </h4>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {expense.fuelStation && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-blue-700 text-sm font-medium">
                          Fuel Station:
                        </span>
                        <span className="font-semibold text-blue-900 uppercase">
                          {expense.fuelStation}
                        </span>
                      </div>
                    )}
                    {expense.billInvoice && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-blue-700 text-sm font-medium">
                          Bill/Invoice:
                        </span>
                        <span className="font-semibold text-blue-900 uppercase">
                          {expense.billInvoice}
                        </span>
                      </div>
                    )}
                    {expense.quantity && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-blue-700 text-sm font-medium">
                          Quantity:
                        </span>
                        <span className="font-semibold text-blue-900">
                          {expense.quantity} Gallons
                          <div className="text-xs text-blue-600">
                            (≈ {gallonsToLiters(expense.quantity)} Liters)
                          </div>
                        </span>
                      </div>
                    )}
                    {expense.dhs && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-blue-700 text-sm font-medium">
                          Price per Gallon:
                        </span>
                        <span className="font-semibold text-blue-900">
                          AED {expense.dhs}
                        </span>
                      </div>
                    )}
                    {expense.fills && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-blue-700 text-sm font-medium">
                          Number of Fills:
                        </span>
                        <span className="font-semibold text-blue-900">
                          {expense.fills}
                        </span>
                      </div>
                    )}
                  </div>

                  {expense.quantity && expense.dhs && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 text-sm font-medium">
                          Calculated Total:
                        </span>
                        <span className="font-bold text-blue-900 text-lg">
                          AED{" "}
                          {(
                            parseFloat(expense.quantity) *
                            parseFloat(expense.dhs)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {expense.quantity} Gal × AED {expense.dhs} = AED{" "}
                        {(
                          parseFloat(expense.quantity) * parseFloat(expense.dhs)
                        ).toFixed(2)}
                        <br />
                        Equivalent: {gallonsToLiters(expense.quantity)} L × AED{" "}
                        {(parseFloat(expense.dhs) / GALLON_TO_LITER).toFixed(3)}{" "}
                        per L
                      </div>
                      {/* Show variance if calculated total differs from actual amount */}
                      {(
                        parseFloat(expense.quantity) * parseFloat(expense.dhs)
                      ).toFixed(2) !==
                        parseFloat(expense.amount).toFixed(2) && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-600 text-sm">⚠️</span>
                            <span className="text-yellow-800 text-xs font-medium">
                              Note: Calculated total (AED{" "}
                              {(
                                parseFloat(expense.quantity) *
                                parseFloat(expense.dhs)
                              ).toFixed(2)}
                              ) differs from actual amount (AED{" "}
                              {parseFloat(expense.amount).toFixed(2)})
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {expense.quantity && expense.fills && (
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Avg per Fill:</span>
                          <span className="font-medium text-blue-900">
                            {(
                              parseFloat(expense.quantity) /
                              parseFloat(expense.fills)
                            ).toFixed(2)}{" "}
                            Gal
                            <div className="text-xs text-blue-600">
                              (≈{" "}
                              {gallonsToLiters(
                                parseFloat(expense.quantity) /
                                  parseFloat(expense.fills)
                              )}{" "}
                              L)
                            </div>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Cost per Fill:</span>
                          <span className="font-medium text-blue-900">
                            AED{" "}
                            {(
                              parseFloat(expense.amount) /
                              parseFloat(expense.fills)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Details */}
          {(expense.category === "Machanic Expense"||expense.category==="Machanic Expense") && (
            <div className="mt-6">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-sm">🔧</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    Maintenance Details
                  </h4>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {expense.maintenanceShop && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-yellow-700 text-sm font-medium">
                          Shop Name:
                        </span>
                        <span className="font-semibold text-yellow-900 uppercase">
                          {expense.maintenanceShop}
                        </span>
                      </div>
                    )}
                    {expense.maintenanceBillNo && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                        <span className="text-yellow-700 text-sm font-medium">
                          Bill Number:
                        </span>
                        <span className="font-semibold text-yellow-900 uppercase">
                          {expense.maintenanceBillNo}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-yellow-700 text-sm font-medium">
                        Service Type:
                      </span>
                      <span className="font-semibold text-yellow-900">
                        {expense.category.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-yellow-700 text-sm font-medium">
                        Service Date:
                      </span>
                      <span className="font-semibold text-yellow-900">
                        {expense.date.split("T")[0]}
                      </span>
                    </div>
                  </div>

                  {/* Maintenance Summary */}
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-700 text-sm font-medium">
                        Total Service Cost:
                      </span>
                      <span className="font-bold text-yellow-900 text-lg">
                        AED {parseFloat(expense.amount).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-yellow-600 mt-1">
                      Maintenance service performed on{" "}
                      {expense.date.split("T")[0]}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Vehicle:</span>
                        <span className="font-medium text-yellow-900 uppercase">
                          {expense["vehicleDetails.plateNumber"]}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-700">
                          Service Category:
                        </span>
                        <span className="font-medium text-yellow-900">
                          MAINTENANCE
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 text-sm">🔧</span>
                      <span className="text-yellow-800 text-xs font-medium">
                        Maintenance Service Details
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-yellow-700">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {expense.maintenanceShop && (
                          <div>• Shop: {expense.maintenanceShop}</div>
                        )}
                        {expense.maintenanceBillNo && (
                          <div>• Bill: {expense.maintenanceBillNo}</div>
                        )}
                        <div>
                          • Cost: AED {parseFloat(expense.amount).toFixed(2)}
                        </div>
                        <div>• Date: {expense.date.split("T")[0]}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h4 className="text-base lg:text-lg font-semibold text-black border-b border-gray-200 pb-2 mb-4">
              Remarks
            </h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm uppercase">
              {expense.remarks || "No remarks"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                onClose();
                if (onEdit) onEdit(expense);
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg"
            >
              Edit Expense
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExpenseDetail;

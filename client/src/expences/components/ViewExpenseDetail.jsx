import React from "react";

const ViewExpenseDetail = ({ expense, onClose }) => {
  if (!expense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Expense Details</h2>
        <div className="space-y-2 text-gray-700">
          <div>
            <span className="font-semibold">Description:</span> {expense.description || "-"}
          </div>
          <div>
            <span className="font-semibold">Amount:</span> AED {expense.amount || "-"}
          </div>
          <div>
            <span className="font-semibold">Category:</span> {expense.category || "-"}
          </div>
          <div>
            <span className="font-semibold">Vehicle:</span> {expense.vehicleDetails?.plateNumber || expense.vehicleId || "-"}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {expense.date ? new Date(expense.date).toLocaleDateString() : "-"}
          </div>
          <div>
            <span className="font-semibold">Remarks:</span> {expense.remarks || "-"}
          </div>
          {/* Fuel-specific fields */}
          {expense.category?.toLowerCase() === "fuel" && (
            <>
              <div>
                <span className="font-semibold">Quantity:</span> {expense.quantity || "-"}
              </div>
              <div>
                <span className="font-semibold">DHS:</span> {expense.dhs || "-"}
              </div>
              <div>
                <span className="font-semibold">Fills:</span> {expense.fills || "-"}
              </div>
              <div>
                <span className="font-semibold">Fuel Station:</span> {expense.fuelStation || "-"}
              </div>
              <div>
                <span className="font-semibold">Bill/Invoice:</span> {expense.billInvoice || "-"}
              </div>
            </>
          )}
          {/* Maintenance-specific fields */}
          {expense.category?.toLowerCase() === "maintenance" && (
            <>
              <div>
                <span className="font-semibold">Maintenance Shop:</span> {expense.maintenanceShop || "-"}
              </div>
              <div>
                <span className="font-semibold">Maintenance Bill No:</span> {expense.maintenanceBillNo || "-"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewExpenseDetail;

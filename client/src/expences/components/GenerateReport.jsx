import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

const CATEGORY_OPTIONS = [
  "Fuel",
  "Mechanic Expense",
  "Electriction exercise",
  "Spare parts Expense",
  "Office Expense",
  "Office rent",
  "Car petrol",
  "Staff salary",
  "Trade licence renewal",
  "DP world payment",
  "Petty cash",
  "Company road permit fee",
  "Other Expense",
];

const GenerateReport = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [fuelStations, setFuelStations] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedFuelStation, setSelectedFuelStation] = useState("");
  const [selectedMechanic, setSelectedMechanic] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const truncateDate = (date) => new Date(date.toDateString());

  useEffect(() => {
    if (category === "Fuel") {
      api.get("/api/user/viewfuelstation").then(res => {
        setFuelStations(res.data.fuelStationsData || []);
      });
    }
    if (category === "Mechanic Expense") {
      api.get("/api/user/viewmechanic").then(res => {
        setMechanics(res.data.mechanicsData || []);
      });
    }
    if (category === "Staff salary") {
      api.get("/api/user/viewdriver").then(res => {
        setDrivers(res.data.DriverData || []);
      });
    }
  }, [category]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/api/user/viewexpences");
      setReportData(res.data.expenceData || []);
    } catch (err) {
      console.error("Error fetching expense data:", err);
      setReportData([]);
    }
    setLoading(false);
  };

  const getFilteredData = () => {
    if (!reportData.length) return [];

    return reportData.filter(row => {
      if (category && row.category !== category) return false;
      if (category === "Fuel" && selectedFuelStation && row.fuelStation !== selectedFuelStation) return false;
      if (category === "Mechanic Expense" && selectedMechanic && row.maintenanceShop !== selectedMechanic) return false;
      if (category === "Staff salary" && selectedDriver && row["driverdetails.drivername"] !== selectedDriver) return false;

      const rowDate = truncateDate(new Date(row.date));
      if (fromDate && rowDate < truncateDate(new Date(fromDate))) return false;
      if (toDate && rowDate > truncateDate(new Date(toDate))) return false;

      return true;
    });
  };

  const filteredData = getFilteredData();
  const totalAmount = filteredData.reduce((sum, row) => sum + (row.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow">
      
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-1 print:hidden"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 print:hidden">
        <h2 className="text-xl font-bold">Generate Expense Report</h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Print Report
        </button>
      </div>

      <form className="space-y-4 print:hidden" onSubmit={handleGenerate}>
        <div>
          <label htmlFor="category" className="block font-medium mb-1">Category</label>
          <select
            id="category"
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={e => {
              setCategory(e.target.value);
              setSelectedFuelStation("");
              setSelectedMechanic("");
              setSelectedDriver("");
            }}
          >
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {category === "Fuel" && (
          <div>
            <label htmlFor="fuelStation" className="block font-medium mb-1">Fuel Station</label>
            <select
              id="fuelStation"
              className="w-full border rounded px-3 py-2"
              value={selectedFuelStation}
              onChange={e => setSelectedFuelStation(e.target.value)}
            >
              <option value="">All Fuel Stations</option>
              {fuelStations.map(st => (
                <option key={st.id} value={st.stationName}>{st.stationName}</option>
              ))}
            </select>
          </div>
        )}

        {category === "Mechanic Expense" && (
          <div>
            <label htmlFor="mechanic" className="block font-medium mb-1">Mechanic</label>
            <select
              id="mechanic"
              className="w-full border rounded px-3 py-2"
              value={selectedMechanic}
              onChange={e => setSelectedMechanic(e.target.value)}
            >
              <option value="">All Mechanics</option>
              {mechanics.map(m => (
                <option key={m.id} value={m.shopName}>{m.shopName}</option>
              ))}
            </select>
          </div>
        )}

        {category === "Staff salary" && (
          <div>
            <label htmlFor="driver" className="block font-medium mb-1">Driver</label>
            <select
              id="driver"
              className="w-full border rounded px-3 py-2"
              value={selectedDriver}
              onChange={e => setSelectedDriver(e.target.value)}
            >
              <option value="">All Drivers</option>
              {drivers.map(d => (
                <option key={d.id} value={d.drivername}>{d.drivername}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="fromDate" className="block font-medium mb-1">From</label>
            <input
              id="fromDate"
              type="date"
              className="w-full border rounded px-3 py-2"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="toDate" className="block font-medium mb-1">To</label>
            <input
              id="toDate"
              type="date"
              className="w-full border rounded px-3 py-2"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded font-semibold flex items-center gap-2"
          disabled={loading}
        >
          <FaSearch /> {loading ? "Loading..." : "Apply Filters"}
        </button>
      </form>

      {/* Report Table */}
      <div className="mt-8">
        {filteredData.length > 0 ? (
          <div>
            <div className="mb-4 p-2 bg-gray-100 rounded flex flex-col md:flex-row md:items-center md:justify-between gap-2 print:bg-white print:p-0">
              <p className="font-semibold">Total Expenses: AED {totalAmount.toFixed(2)}</p>
              <p className="text-sm">Showing {filteredData.length} records</p>
            </div>

            <div
              className={`w-full overflow-x-auto rounded border print:border-0 print:max-h-none ${
                filteredData.length > 10 ? "max-h-[60vh] overflow-y-auto" : "max-h-none"
              } min-h-[200px] bg-white`}
              style={{ transition: "max-height 0.2s" }}
            >
              <table className="w-full min-w-[600px] border text-xs md:text-sm print:text-xs">
                <thead>
                  <tr className="bg-gray-100 print:bg-white">
                    <th className="p-2 border text-left">Date</th>
                    <th className="p-2 border text-left">Description</th>
                    <th className="p-2 border text-left">Amount (AED)</th>
                    <th className="p-2 border text-left">Category</th>
                    <th className="p-2 border text-left">Vehicle</th>
                    <th className="p-2 border text-left">Driver</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white print:bg-white" : "bg-gray-50 print:bg-white"}>
                      <td className="p-2 border">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="p-2 border">{row.description}</td>
                      <td className="p-2 border">{row.amount?.toFixed(2)}</td>
                      <td className="p-2 border">{row.category}</td>
                      <td className="p-2 border">{row["vehicleDetails.plateNumber"]}</td>
                      <td className="p-2 border">{row["driverdetails.drivername"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-6 p-4 border rounded bg-gray-50 print:hidden">
            {reportData.length ? "No records match your filters" : "No data available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReport;

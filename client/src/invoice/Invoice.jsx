import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, FileText, Eye, Truck, MapPin, X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import InvoiceNoVatGenerate from "./components/InvoiceNoVatGenerate";
import InvoiceVatGenerate from "./components/InvoiceVatGenerate";

const Invoice = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Add new states for invoice generation
  const [showVatInvoice, setShowVatInvoice] = useState(false);
  const [showNoVatInvoice, setShowNoVatInvoice] = useState(false);
  const [currentInvoiceData, setCurrentInvoiceData] = useState(null);

  // Simple filter states
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const navigate = useNavigate();

  // Get unique companies for filter dropdown
  const uniqueCompanies = [
    ...new Set(
      orders
        .map(
          (order) =>
            order["CustomerDetails.companyname"] ||
            order["CustomerDetails.customername"]
        )
        .filter(Boolean)
    ),
  ].sort();

  // Simple filter function for modal orders
  const getFilteredOrders = () => {
    return orders.filter((order) => {
      const matchesSearch =
        modalSearchTerm === "" ||
        order.containerNumber
          .toLowerCase()
          .includes(modalSearchTerm.toLowerCase()) ||
        order["CustomerDetails.customername"]
          .toLowerCase()
          .includes(modalSearchTerm.toLowerCase()) ||
        order.from.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        order.to.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        order.id.toString().includes(modalSearchTerm);

      const matchesCompany =
        selectedCompany === "" ||
        (order["CustomerDetails.companyname"] ||
          order["CustomerDetails.customername"]) === selectedCompany;

      return matchesSearch && matchesCompany;
    });
  };

  // Check authentication
  const checkAccountLogin = async () => {
    setPageLoading(true);
    try {
      const response = await api.get("/api/user/authcheck");
      if (response.data.authenticated === true) {
        await Promise.all([fetchInvoices(), fetchOrders()]);
      } else {
        navigate("/signin");
      }
    } catch (error) {
      console.log("error in checking user login", error);
      navigate("/signin");
    } finally {
      setPageLoading(false);
    }
  };

  // Fetch invoices from backend
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/user/viewinvoices");
      if (response.data.success) {
        setInvoices(response.data.invoices || []);
      } else {
        toast.error("Failed to fetch invoices", { duration: 3000 });
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Error loading invoices", { duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      const response = await api.get("/api/user/vieworders");
      if (response.data.success) {
        setOrders(response.data.OrderData || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error loading orders", { duration: 3000 });
    }
  }, []);

  useEffect(() => {
    checkAccountLogin();
  }, []);

  const handleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const createInvoice = async () => {
    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order", { duration: 2000 });
      return;
    }

    setIsCreatingInvoice(true);
    try {
      const selectedOrdersData = orders.filter((order) =>
        selectedOrders.includes(order.id)
      );

      // Check if all selected orders have the same company name
      const companiesInSelectedOrders = selectedOrdersData.map(
        (order) =>
          order["CustomerDetails.companyname"] ||
          order["CustomerDetails.customername"]
      );

      const uniqueCompanies = [...new Set(companiesInSelectedOrders)];

      if (uniqueCompanies.length > 1) {
        toast.error(
          "All selected orders must belong to the same company. Please select orders from one company only.",
          {
            duration: 4000,
          }
        );
        setIsCreatingInvoice(false);
        return;
      }

      const totalAmount = selectedOrdersData.reduce(
        (sum, order) => sum + parseFloat(order.total || 0),
        0
      );

      const customerName =
        selectedOrdersData[0]["CustomerDetails.customername"];
      const companyName =
        selectedOrdersData[0]["CustomerDetails.companyname"] || customerName;
      const customerId = selectedOrdersData[0].customer;

      const generateInvoiceId = () => {
        if (invoices.length === 0) {
          return "INV-001";
        }

        const numericIds = invoices
          .map((invoice) => {
            const id = invoice.id.toString();

            const match = id.match(/(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          })
          .filter((num) => !isNaN(num));

        const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
        const nextId = maxId + 1;

        // Format as INV-XXX with zero padding
        return `INV-${nextId.toString().padStart(3, "0")}`;
      };

      const invoiceId = generateInvoiceId();

      // Prepare invoice data matching backend structure: {id, customer, date, company, total, status, orders}
      const invoiceData = {
        id: invoiceId,
        customer: customerId,
        date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        company: companyName,
        total: totalAmount,
        status: "Pending",
        orders: selectedOrders, // Array of order IDs
      };

      console.log("Sending invoice data:", invoiceData); // Debug log

      const response = await api.post("/api/user/saveinvoice", invoiceData);

      if (response.data.success) {
        toast.success(response.data.message || "Invoice created successfully", {
          duration: 2000,
        });
        setSelectedOrders([]);
        setShowCreateModal(false);
        setModalSearchTerm("");
        setSelectedCompany("");
        await fetchInvoices(); // Refresh invoices list
      } else {
        toast.error(response.data.message || "Failed to create invoice", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error creating invoice", { duration: 3000 });
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (invoice.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.company || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (order) =>
      (order.containerNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order["CustomerDetails.customername"] || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (order.from || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.to || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateVatInvoice = (invoice) => {
    setCurrentInvoiceData(invoice);
    setShowVatInvoice(true);
  };

  const handleGenerateNoVatInvoice = (invoice) => {
    setCurrentInvoiceData(invoice);
    setShowNoVatInvoice(true);
  };

  const closeInvoiceGenerators = () => {
    setShowVatInvoice(false);
    setShowNoVatInvoice(false);
    setCurrentInvoiceData(null);
  };

  // Show loading spinner during authentication check
  if (pageLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        } p-6`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invoice Management
            </h1>
            <p className="text-gray-600">
              Manage your invoices and orders efficiently
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "invoices"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Orders ({orders.length})
            </button>
          </div>

          {/* Search and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            {activeTab === "invoices" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="ml-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </button>
            )}
          </div>

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  All Invoices
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading invoices...</p>
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No invoices found</p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-gray-900 hover:underline"
                      >
                        Create your first invoice
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Invoice ID
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Company
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Orders
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Total
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.map((invoice, index) => (
                          <tr
                            key={invoice.id || index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {invoice.id}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600 uppercase">
                              {invoice.company}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {invoice.orderCount}
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                              AED {parseFloat(invoice.total || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => setShowInvoiceDetail(invoice)}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  All Orders
                </h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading orders...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Order ID
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Date
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Container
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Route
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Customer
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Driver
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Total
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(
                                order.date || order.createdAt
                              ).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-600 uppercase">
                              {order.containerNumber}
                            </td>
                            <td className="py-3 px-4 text-gray-600 uppercase">
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {order.from} → {order.to}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600 uppercase">
                              {order["CustomerDetails.customername"]}
                            </td>
                            <td className="py-3 px-4 text-gray-600 uppercase">
                              {order["driverDetails.drivername"]}
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                              AED {parseFloat(order.total || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  order.paidStatus === true ||
                                  order.paidStatus === 1
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.paidStatus === true ||
                                order.paidStatus === 1
                                  ? "Paid"
                                  : "Unpaid"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Create Invoice Modal with Simple Filters */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Create New Invoice
                    </h2>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setSelectedOrders([]);
                        setModalSearchTerm("");
                        setSelectedCompany("");
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Filter Section */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={modalSearchTerm}
                          onChange={(e) => setModalSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="w-64">
                      <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      >
                        <option value="">All Companies</option>
                        {uniqueCompanies.map((company) => (
                          <option key={company} value={company}>
                            {company.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    {(modalSearchTerm || selectedCompany) && (
                      <button
                        onClick={() => {
                          setModalSearchTerm("");
                          setSelectedCompany("");
                        }}
                        className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    Showing {getFilteredOrders().length} of {orders.length}{" "}
                    orders
                  </div>
                </div>

                {/* Orders List - Scrollable */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        Select Orders to Include
                      </h3>
                      {selectedOrders.length > 0 && (
                        <button
                          onClick={() => setSelectedOrders([])}
                          className="text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Clear Selection ({selectedOrders.length})
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 pt-0">
                    {getFilteredOrders().length === 0 ? (
                      <div className="text-center py-12">
                        <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          {orders.length === 0
                            ? "No orders available"
                            : "No orders match your search"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {getFilteredOrders().map((order) => (
                          <div
                            key={order.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedOrders.includes(order.id)
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => handleOrderSelection(order.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">
                                    Order #{order.id}
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    AED{" "}
                                    {parseFloat(order.total || 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">
                                      Container:
                                    </span>{" "}
                                    <span className="uppercase">
                                      {order.containerNumber}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Date:</span>{" "}
                                    {new Date(
                                      order.date || order.createdAt
                                    ).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">
                                      Customer:
                                    </span>{" "}
                                    <span className="uppercase">
                                      {order["CustomerDetails.customername"]}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium">Route:</span>{" "}
                                    <span className="uppercase">
                                      {order.from} → {order.to}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <input
                                  type="checkbox"
                                  checked={selectedOrders.includes(order.id)}
                                  onChange={() =>
                                    handleOrderSelection(order.id)
                                  }
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Action Buttons - Always Visible */}
                <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {selectedOrders.length} order(s) selected
                      {selectedOrders.length > 0 && (
                        <span className="ml-2 font-medium">
                          Total: AED{" "}
                          {orders
                            .filter((o) => selectedOrders.includes(o.id))
                            .reduce(
                              (sum, o) => sum + parseFloat(o.total || 0),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          setSelectedOrders([]);
                          setModalSearchTerm("");
                          setSelectedCompany("");
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg"
                        disabled={isCreatingInvoice}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={createInvoice}
                        disabled={
                          selectedOrders.length === 0 || isCreatingInvoice
                        }
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium"
                      >
                        {isCreatingInvoice ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Invoice
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Detail Modal - Enhanced Design */}
          {showInvoiceDetail && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        Invoice Details
                      </h2>
                      <p className="text-gray-300 text-sm">
                        Invoice #{showInvoiceDetail.id}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowInvoiceDetail(null)}
                      className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {/* Invoice Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Invoice Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Invoice ID:
                          </span>
                          <span className="font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                            {showInvoiceDetail.id}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Date:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {new Date(
                              showInvoiceDetail.date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 font-medium">
                            Status:
                          </span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                        <Truck className="w-5 h-5 mr-2" />
                        Company Information
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">
                            Company:
                          </span>
                          <span className="font-bold text-green-900 uppercase bg-green-100 px-3 py-1 rounded-full">
                            {showInvoiceDetail.company}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">
                            Orders:
                          </span>
                          <span className="font-semibold text-green-900">
                            {showInvoiceDetail.orderCount} orders
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 font-medium">
                            Total Amount:
                          </span>
                          <span className="font-bold text-green-900 text-lg">
                            AED{" "}
                            {parseFloat(showInvoiceDetail.total || 0).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Generation Section */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                      <FileText className="w-6 h-6 mr-2 text-gray-700" />
                      Generate Invoice Documents
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Choose your preferred invoice format and download or print
                      directly.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() =>
                          handleGenerateNoVatInvoice(showInvoiceDetail)
                        }
                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Print Invoice (No VAT)
                      </button>
                      <button
                        onClick={() =>
                          handleGenerateVatInvoice(showInvoiceDetail)
                        }
                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Print Invoice (With VAT)
                      </button>
                    </div>
                  </div>

                  {/* Order Details Section */}
                  <div className="border-t-2 border-gray-200 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-gray-900 text-xl flex items-center">
                        <MapPin className="w-6 h-6 mr-2 text-gray-700" />
                        Order Details
                      </h3>
                      <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {showInvoiceDetail.orderCount} orders
                      </span>
                    </div>

                    {showInvoiceDetail.orders &&
                    showInvoiceDetail.orders.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                        {showInvoiceDetail.orders.map((order, index) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="font-bold text-gray-900 text-lg">
                                    Order #{order.id}
                                  </div>
                                  <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-semibold">
                                    #{index + 1}
                                  </span>
                                  <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                      order.paidStatus === true ||
                                      order.paidStatus === 1
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {order.paidStatus === true ||
                                    order.paidStatus === 1
                                      ? "PAID"
                                      : "UNPAID"}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 uppercase font-semibold bg-gray-100 px-3 py-1 rounded-lg inline-block">
                                  Container: {order.containerNumber}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0 ml-6">
                                <div className="font-bold text-gray-900 text-2xl">
                                  AED {parseFloat(order.total || 0).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Route
                                </span>
                                <span className="font-bold uppercase text-gray-900 text-sm">
                                  {order.from} → {order.to}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Date
                                </span>
                                <span className="font-bold text-gray-900 text-sm">
                                  {new Date(order.date).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Driver
                                </span>
                                <span className="font-bold uppercase text-gray-900 text-sm">
                                  {order.driverDetails?.drivername || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Vehicle
                                </span>
                                <span className="font-bold text-gray-900 text-sm">
                                  {order.vehicleDetails?.plateNumber || "N/A"}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Type
                                </span>
                                <span className="font-bold uppercase text-gray-900 text-sm">
                                  {order.type}
                                </span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="text-gray-600 font-semibold text-xs uppercase tracking-wide block mb-1">
                                  Base Rate
                                </span>
                                <span className="font-bold text-gray-900 text-sm">
                                  AED {order.rate}
                                </span>
                              </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="mt-6 pt-4 border-t-2 border-gray-200">
                              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                                Cost Breakdown
                              </h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">
                                      Base Rate:
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      AED {order.rate}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">
                                      Token:
                                    </span>
                                    <span className="font-bold text-gray-900">
                                      AED {order.token || 0}
                                    </span>
                                  </div>
                                  {order.extra > 0 && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">
                                          Extra ({order.extratype}):
                                        </span>
                                        <span className="font-bold text-gray-900">
                                          AED {order.extra}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-600 font-medium">
                                          VAT:
                                        </span>
                                        <span className="font-bold text-gray-900">
                                          AED {order.vat}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {order.custwash && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 font-medium">
                                        Customer Wash:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        AED {order.custwash}
                                      </span>
                                    </div>
                                  )}
                                  {order.merc > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 font-medium">
                                        Mercury:
                                      </span>
                                      <span className="font-bold text-gray-900">
                                        AED {order.merc}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-3 pt-3 border-t-2 border-gray-300 flex justify-between font-bold text-lg">
                                  <span className="text-gray-900">Total:</span>
                                  <span className="text-gray-900">
                                    AED{" "}
                                    {parseFloat(order.total || 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <div className="text-gray-400 mb-4">
                          <FileText className="w-16 h-16 mx-auto" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">
                          Order details not available
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          No order information found for this invoice
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total Summary */}
                  <div className="border-t-2 border-gray-200 pt-6 mt-8">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-gray-300 text-lg font-medium">
                            Total Invoice Amount
                          </span>
                          <p className="text-gray-400 text-sm mt-1">
                            Including all orders and applicable taxes
                          </p>
                        </div>
                        <span className="text-3xl font-bold">
                          AED{" "}
                          {parseFloat(showInvoiceDetail.total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VAT Invoice Generation Modal */}
          {showVatInvoice && currentInvoiceData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full h-full max-w-full max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={closeInvoiceGenerators}
                  className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <InvoiceVatGenerate
                  invoiceData={currentInvoiceData}
                  onClose={closeInvoiceGenerators}
                />
              </div>
            </div>
          )}

          {/* No VAT Invoice Generation Modal */}
          {showNoVatInvoice && currentInvoiceData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full h-full max-w-full max-h-[95vh] overflow-auto relative rounded-lg">
                <button
                  onClick={closeInvoiceGenerators}
                  className="absolute top-4 right-4 z-10 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors print:hidden"
                >
                  Close
                </button>
                <InvoiceNoVatGenerate
                  invoiceData={currentInvoiceData}
                  onClose={closeInvoiceGenerators}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoice;

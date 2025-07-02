import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const OverviewInvoice = ({ customerid }) => {
  const [customerData, setCustomerData] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/customerdata/${customerid}`);
      console.log(response.data);
      
      if (response.data.success && response.data.customerData) {
        setCustomerData(response.data.customerData);
        setCustomerName(response.data.customerInfo.customername);
      } else {
        toast.error("No customer data found", {
          duration: 3000
        });
      }
    } catch (error) {
      console.log("error in getting customer data", error);
      toast.error("Error in getting data", {
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, [customerid]);

  // Calculate overview statistics
  const calculateOverview = () => {
    const totalOrders = customerData.length;
    const totalContainers = customerData.length; // Assuming 1 container per order
    const totalInspectionCost = customerData.reduce((sum, item) => sum + (parseFloat(item.merc) || 0), 0);
    const totalTokenCharges = customerData.reduce((sum, item) => sum + (parseFloat(item.token) || 0), 0);
    const totalRate = customerData.reduce((sum, item) => sum + (parseFloat(item.rate) || 0), 0);
    const totalExtra = customerData.reduce((sum, item) => sum + (parseFloat(item.extra) || 0), 0);
    const subtotal = customerData.reduce((sum, item) => sum + (parseFloat(item.total) - parseFloat(item.vat || 0)), 0);
    const vatAmount = customerData.reduce((sum, item) => sum + parseFloat(item.vat || 0), 0);
    const netTotal = subtotal + vatAmount;
    
    return { 
      totalOrders, 
      totalContainers, 
      totalInspectionCost, 
      totalTokenCharges, 
      totalRate,
      totalExtra,
      subtotal, 
      vatAmount, 
      netTotal 
    };
  };

  const overview = calculateOverview();

  const convertToWords = (amount) => {
    if (amount === 0) return 'ZERO';
    return `${amount.toLocaleString()} ONLY`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-lg">Loading invoice data...</div>
      </div>
    );
  }

  const companyInfo = { trn: '104235363900003' };
  const invoiceDetails = {
    clientName: customerName || 'CLIENT NAME',
    clientAddress: 'CLIENT ADDRESS',
    clientTrn: '100601837600003',
    invoiceNo: `BAST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    date: new Date().toLocaleDateString('en-GB')
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Print Button */}
      <div className="mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🖨️ Print Invoice
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg print:shadow-none print:max-w-none print:mx-0">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-500 to-gray-800 text-white px-4 py-3 font-bold text-2xl rounded">
              EAST
            </div>
            <div className="flex flex-col">
              <div className="text-lg text-gray-600 text-right mb-1" dir="rtl">
                برج السماء للنقليات ش.ذ.م.م
              </div>
              <div className="text-base font-bold text-gray-800">
                BURJ AL SAMA TRANSPORT L.L.C
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="text-center my-6">
          <div className="border-2 border-gray-800 p-4 inline-block min-w-80">
            <h2 className="text-xl font-bold mb-1">TAX INVOICE - OVERVIEW</h2>
            <p className="text-sm">TRN : {companyInfo?.trn || '104235363900003'}</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between my-6">
          <div className="space-y-1">
            <p className="font-bold">TO</p>
            <p>{invoiceDetails?.clientName || 'CLIENT NAME'}</p>
            <p>{invoiceDetails?.clientAddress || 'CLIENT ADDRESS'}</p>
            <p>TRN {invoiceDetails?.clientTrn || '100601837600003'}</p>
          </div>
          <div className="text-right space-y-1">
            <p>INVOICE NO : {invoiceDetails?.invoiceNo || 'BAST-042'}</p>
            <p>DATE : {invoiceDetails?.date || new Date().toLocaleDateString('en-GB')}</p>
          </div>
        </div>

        {/* Overview Summary Table */}
        <div className="my-6">
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 p-3 text-center font-bold">DESCRIPTION</th>
                <th className="border border-gray-800 p-3 text-center font-bold">QUANTITY/COUNT</th>
                <th className="border border-gray-800 p-3 text-center font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Total Number of Orders</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalOrders}</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Total Containers Handled</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalContainers}</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Transportation Charges</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalRate.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Container Inspection Cost</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalInspectionCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Token Charges</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalTokenCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">Extra Charges</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalExtra.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-800 p-3 text-left font-bold">SUBTOTAL</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold">{overview.subtotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-800 p-3 text-left font-bold">VAT 5%</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold">{overview.vatAmount.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-3 text-left font-bold">NET TOTAL</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold text-lg">{overview.netTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Amount in Words */}
        <div className="my-6 p-4 border border-gray-800 bg-gray-50">
          <p className="font-bold">
            AMOUNT IN WORDS: {convertToWords(overview.netTotal)}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between mt-8 gap-8">
          <div className="flex-1">
            <div className="mb-6">
              <p>PREPARED BY / _______________</p>
            </div>
            
            <div className="space-y-1">
              <p className="font-bold">BANK DETAIL :</p>
              <p className="text-xs">A/C NO : 1341221502001</p>
              <p className="text-xs">IBAN : AE280030013412215020001</p>
              <p className="text-xs">NAME : BURJ AL SAMA TRANSPORT LLC</p>
              <p className="text-xs">SWIFT CODE : ADCBAEAAXXX</p>
              <p className="text-xs">BANK : ABU DHABI COMMERCIAL BANK</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <p>RECEIVE BY / _______________</p>
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="font-bold text-xs">CONTACT DETAIL :</p>
              <p className="text-xs">NAME : MALIK USAMA</p>
              <p className="text-xs">CONTACT NO : 0568002250</p>
              <p className="font-bold text-xs">CONTACT DETAIL :</p>
              <p className="text-xs">NAME : ABID DAUD</p>
              <p className="text-xs">CONTACT NO : 0552347526</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 border-2 border-gray-800 rounded-full flex items-center justify-center mx-auto">
                <p className="text-xs text-center px-1">BURJ AL SAMA TRANSPORT L.L.C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-6 pt-6 border-t border-gray-300 text-xs space-y-1">
          <p>📞 +971 56 800 2250 / +971 55 234 7526 | 📧 burjalsamatransport@gmail.com</p>
          <p>📍 Office O- Malak Elham Muhammad Amin Mirza Ghafari - Deira - Abu Hail 207</p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default OverviewInvoice;
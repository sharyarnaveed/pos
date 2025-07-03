import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const OverviewInvoice = ({ customerid }) => {
  const [customerData, setCustomerData] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/customerdata/${customerid}`);
      console.log(response.data);
      
      if (response.data.success && response.data.customerData) {
        setCustomerData(response.data.customerData);
        setCustomerInfo(response.data.customerInfo);
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
    
    const ones = ["", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE"];
    const teens = ["TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
    const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
    const thousands = ["", "THOUSAND", "MILLION", "BILLION"];
    
    const convertHundreds = (n) => {
      let result = "";
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + " HUNDRED ";
        n %= 100;
      }
      if (n >= 10 && n < 20) {
        result += teens[n - 10] + " ";
      } else {
        if (n >= 20) {
          result += tens[Math.floor(n / 10)] + " ";
          n %= 10;
        }
        if (n > 0) {
          result += ones[n] + " ";
        }
      }
      return result.trim();
    };
    
    const integerPart = Math.floor(amount);
    const decimalPart = Math.round((amount - integerPart) * 100);
    
    let result = "";
    let chunkCount = 0;
    let tempNum = integerPart;
    
    if (tempNum === 0) {
      result = "ZERO";
    } else {
      while (tempNum > 0) {
        const chunk = tempNum % 1000;
        if (chunk !== 0) {
          const chunkWords = convertHundreds(chunk);
          result = chunkWords + (thousands[chunkCount] ? " " + thousands[chunkCount] : "") + (result ? " " + result : "");
        }
        tempNum = Math.floor(tempNum / 1000);
        chunkCount++;
      }
    }
    
    if (decimalPart > 0) {
      result += " & " + convertHundreds(decimalPart) + " FILS";
    }
    
    return result + " ONLY.";
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-lg">LOADING INVOICE DATA...</div>
      </div>
    );
  }

  const companyInfo = { trn: '104235363900003' };
  const invoiceDetails = {
    clientName: String(customerInfo?.customername || 'CLIENT NAME').toUpperCase(),
    clientAddress: String(customerInfo?.address || 'CLIENT ADDRESS').toUpperCase(),
    clientTrn: String(customerInfo?.taxnumber || '100601837600003'),
    companyName: String(customerInfo?.companyname || 'COMPANY NAME').toUpperCase(),
    mainOwner: String(customerInfo?.mainowner || 'MAIN OWNER').toUpperCase(),
    operator: String(customerInfo?.operator || 'OPERATOR').toUpperCase(),
    phoneNo: String(customerInfo?.phoneno || 'PHONE NUMBER'),
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
          🖨️ PRINT INVOICE
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg print:shadow-none print:max-w-none print:mx-0">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-500 to-gray-800 text-white px-4 py-3 font-bold text-2xl rounded">
              BAST
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
            <p className="font-medium">{invoiceDetails.clientName}</p>
            <p>{invoiceDetails.clientAddress}</p>
            {invoiceDetails.companyName !== 'COMPANY NAME' && (
              <p className="font-medium">COMPANY: {invoiceDetails.companyName}</p>
            )}
            <p>TRN: {invoiceDetails.clientTrn}</p>
            <p>PHONE: {invoiceDetails.phoneNo}</p>
            {invoiceDetails.mainOwner !== 'MAIN OWNER' && (
              <p>MAIN OWNER: {invoiceDetails.mainOwner}</p>
            )}
            {invoiceDetails.operator !== 'OPERATOR' && (
              <p>OPERATOR: {invoiceDetails.operator}</p>
            )}
          </div>
          <div className="text-right space-y-1">
            <p>INVOICE NO: {invoiceDetails.invoiceNo}</p>
            <p>DATE: {invoiceDetails.date}</p>
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
                <td className="border border-gray-800 p-3 text-left font-semibold">TOTAL NUMBER OF ORDERS</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalOrders}</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">TOTAL CONTAINERS HANDLED</td>
                <td className="border border-gray-800 p-3 text-center">{overview.totalContainers}</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">TRANSPORTATION CHARGES</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">AED {overview.totalRate.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">CONTAINER INSPECTION COST</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">AED {overview.totalInspectionCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">TOKEN CHARGES</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">AED {overview.totalTokenCharges.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="border border-gray-800 p-3 text-left font-semibold">EXTRA CHARGES</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center">AED {overview.totalExtra.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-800 p-3 text-left font-bold">SUBTOTAL</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold">AED {overview.subtotal.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-800 p-3 text-left font-bold">VAT 5%</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold">AED {overview.vatAmount.toFixed(2)}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="border border-gray-800 p-3 text-left font-bold">NET TOTAL</td>
                <td className="border border-gray-800 p-3 text-center">-</td>
                <td className="border border-gray-800 p-3 text-center font-bold text-lg">AED {overview.netTotal.toFixed(2)}</td>
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
          <p>📞 +971 56 800 2250 / +971 55 234 7526 | 📧 BURJALSAMATRANSPORT@GMAIL.COM</p>
          <p>📍 OFFICE O- MALAK ELHAM MUHAMMAD AMIN MIRZA GHAFARI - DEIRA - ABU HAIL 207</p>
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
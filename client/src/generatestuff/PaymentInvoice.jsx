import React, { useEffect, useState } from 'react'
import api from '../api';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const PaymentInvoice = ({ customerid }) => {
  const [paymentData, setPaymentData] = useState({
    unpaiddata: [],
    paiddata: [],
    total: 0,
    paidtotal: 0,
    unpaidtotal: 0
  });
  const [loading, setLoading] = useState(true);

  const [customername, setCustomerName] = useState('');

  const handlePrint = () => {
    window.print();
  };

  // Format date from backend format to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Transform backend data to invoice format
  const transformDataToInvoiceFormat = (data, isPaid = false) => {
    return data.map((item, index) => ({
      sno: index + 1,
      date: formatDate(item.createdAt),
      from: item.from.toUpperCase(),
      to: item.to.toUpperCase(),
      container: item.containerNumber,
      rate: item.rate,
      token: item.token,
      insp: item.merc || "",
      bills: "",
      extra: item.extra || "",
      amount: (item.total - (item.vat || 0)).toFixed(2),
      status: isPaid ? 'PAID' : 'UNPAID',
      paidAmount: isPaid ? item.paidamount : 0
    }));
  };

  // Combine unpaid and paid data
  const unpaidInvoiceData = transformDataToInvoiceFormat(paymentData.unpaiddata, false);
  const paidInvoiceData = transformDataToInvoiceFormat(paymentData.paiddata, true);
  const allInvoiceData = [...unpaidInvoiceData, ...paidInvoiceData];

  // Recalculate serial numbers for combined data
  const invoiceData = allInvoiceData.map((item, index) => ({
    ...item,
    sno: index + 1
  }));

  // Calculate totals
  const subtotal = invoiceData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  // Convert number to words (simplified version)
  const numberToWords = (num) => {
    if (num === 0) return "ZERO";
    
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
    
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    
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

  const getPaymentData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/paymentreport/${customerid}`);
      console.log(response.data);
      
      if (response.data.success) {
        setPaymentData({
          unpaiddata: response.data.unpaiddata || [],
          paiddata: response.data.paiddata || [],
          total: response.data.total || 0,
          paidtotal: response.data.paidtotal || 0,
          unpaidtotal: response.data.unpaidtotal || 0
        });
        // Assuming customer name comes from the response
        setCustomerName(response.data.customerInfo?.customername || 'N/A');
      } else {
        toast.error("No payment data found", {
          duration: 3000
        });
      }
    } catch (error) {
      console.log("error in getting payment data", error);
      toast.error("Error in getting payment data", {
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentData();
  }, [customerid]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-lg">Loading payment invoice data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Print Button */}
      <div className="mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🖨️ Print Payment Invoice
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white border-2 border-black">
        {/* Header */}
        <div className="border-b-2 border-black">
          {/* Company Logo and Name */}
          <div className="flex items-center justify-center p-2 border-b border-black">
            <div className="w-16 h-16 mr-4">
              {/* Truck Logo from Google */}
              <img 
                src="https://www.svgrepo.com/show/23130/truck.svg" 
                alt="Truck Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "https://cdn-icons-png.flaticon.com/512/2769/2769339.png";
                }}
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">BURJ AL SAMA TRANSPORT LLC</h1>
              <p className="text-sm">CONTACT NO: 055-2347526, P.O.BOX 76498, DUBAI, UAE, E-MAIL: abid.daud@gmail.com</p>
            </div>
          </div>
          
          {/* Invoice Header */}
          <div className="text-center py-2 bg-gray-100">
            <h2 className="text-xl font-bold">PAYMENT INVOICE</h2>
          </div>
        </div>

        {/* Company and Invoice Details */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p><strong>COMPANY NAME:</strong> DMX GLOBAL LOGISTICS LLC.</p>
            <p><strong>CONTACT PERSON:</strong> {customername}</p>
          </div>
          <div className="flex-1 p-3 text-right">
            <p><strong>DATE:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex border-b border-black bg-gray-50">
          <div className="flex-1 p-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p><strong>TOTAL AMOUNT:</strong> {paymentData.total.toFixed(2)}</p>
              </div>
              <div>
                <p><strong>PAID AMOUNT:</strong> {paymentData.paidtotal.toFixed(2)}</p>
              </div>
              <div>
                <p><strong>UNPAID AMOUNT:</strong> {paymentData.unpaidtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-1 py-1 w-8">S/NO</th>
              <th className="border border-black px-1 py-1 w-16">DATE</th>
              <th className="border border-black px-1 py-1 w-20">FROM</th>
              <th className="border border-black px-1 py-1 w-20">TO</th>
              <th className="border border-black px-1 py-1 w-24">CONTAINER</th>
              <th className="border border-black px-1 py-1 w-12">RATE</th>
              <th className="border border-black px-1 py-1 w-12">TOKEN</th>
              <th className="border border-black px-1 py-1 w-12">INSP</th>
              <th className="border border-black px-1 py-1 w-12">BILLS</th>
              <th className="border border-black px-1 py-1 w-12">EXTRA</th>
              <th className="border border-black px-1 py-1 w-16">AMOUNT</th>
              <th className="border border-black px-1 py-1 w-16">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((item, index) => (
              <tr key={index} className={`h-6 ${item.status === 'PAID' ? 'bg-green-50' : 'bg-red-50'}`}>
                <td className="border border-black px-1 py-1 text-center">{item.sno}</td>
                <td className="border border-black px-1 py-1 text-center">{item.date}</td>
                <td className="border border-black px-1 py-1 text-center">{item.from}</td>
                <td className="border border-black px-1 py-1 text-center">{item.to}</td>
                <td className="border border-black px-1 py-1 text-center">{item.container}</td>
                <td className="border border-black px-1 py-1 text-center">{item.rate}</td>
                <td className="border border-black px-1 py-1 text-center">{item.token}</td>
                <td className="border border-black px-1 py-1 text-center">{item.insp}</td>
                <td className="border border-black px-1 py-1 text-center">{item.bills}</td>
                <td className="border border-black px-1 py-1 text-center">{item.extra}</td>
                <td className="border border-black px-1 py-1 text-center">{item.amount}</td>
                <td className={`border border-black px-1 py-1 text-center font-bold ${item.status === 'PAID' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in Words and Totals */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p><strong>TOTAL AMOUNT: {numberToWords(paymentData.total)}</strong></p>
            <p className="mt-2"><strong>OUTSTANDING AMOUNT: {numberToWords(paymentData.unpaidtotal)}</strong></p>
          </div>
          <div className="w-40 p-3">
            <div className="text-right space-y-1">
              <p><strong>TOTAL:</strong> {paymentData.total.toFixed(2)}</p>
              <p className="text-green-600"><strong>PAID:</strong> {paymentData.paidtotal.toFixed(2)}</p>
              <p className="text-red-600"><strong>OUTSTANDING:</strong> {paymentData.unpaidtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex">
          {/* Bank Details */}
          <div className="flex-1 p-3 border-r border-black">
            <h3 className="font-bold mb-2">BANK DETAIL:</h3>
            <div className="text-xs space-y-1">
              <p><strong>A/C NO:</strong> 13412215820001</p>
              <p><strong>IBAN:</strong> AE280030013412215820001</p>
              <p><strong>NAME:</strong> BURJ AL SAMA TRANSPORT LLC</p>
              <p><strong>SWIFT CODE:</strong> ADCBAEAAXXX</p>
              <p><strong>BANK:</strong> ABU DHABI COMMERCIAL BANK</p>
              <p><strong>CONTACT NO:</strong> 055-2347526</p>
            </div>
          </div>
          
          {/* Contact Details */}
          <div className="w-40 p-3">
            <h3 className="font-bold mb-2">CONTACT DETAIL:</h3>
            <div className="text-xs space-y-1">
              <p><strong>NAME:</strong> MALIK USAMA</p>
              <p><strong>CONTACT NO:</strong> 056-8002250</p>
              <div className="mt-3">
                <p><strong>NAME:</strong> ABID DAUD</p>
                <p><strong>JOB NO:</strong> -------------------</p>
              </div>
            </div>
          </div>
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
  )
}

export default PaymentInvoice
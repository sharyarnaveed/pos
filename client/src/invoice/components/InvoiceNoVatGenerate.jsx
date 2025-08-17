import React, { useState } from "react";

const InvoiceNoVatGenerate = ({ invoiceData, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Format date from backend format to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Transform invoice data to invoice format (without VAT)
  const transformDataToInvoiceFormat = (orders) => {
    return orders.map((item, index) => ({
      sno: index + 1,
      date: formatDate(item.date),
      from: String(item.from || "").toUpperCase(),
      to: String(item.to || "").toUpperCase(),
      container: String(item.containerNumber || "").toUpperCase(),
      rate: item.rate || 0,
      token: item.token || 0,
      insp: String(item.merc || "").toUpperCase(),
      bills: "",
      extra: String(item.extra || "").toUpperCase(),
      extratype: String(item.extratype || "").toUpperCase(),
      amount: (item.total - (item.vat || 0)).toFixed(2)
    }));
  };

  const invoiceTableData = transformDataToInvoiceFormat(invoiceData.orders || []);

  // Calculate totals (without VAT)
  const subtotal = invoiceTableData.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const vat = subtotal * 0.05;
  const total = subtotal + vat;

  // Convert number to words
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-lg">LOADING INVOICE DATA...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Controls Section */}
      <div className="mb-4 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-6 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            🖨️ PRINT INVOICE
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white border-2 border-black">
        {/* Header */}
        <div className="border-b-2 border-black">
          <div className="flex items-center justify-center p-2 border-b border-black">
            <div className="w-16 h-16 mr-4">
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
              <p className="text-sm">
                CONTACT NO: 055-2347526, P.O.BOX 76498, DUBAI, UAE, E-MAIL: ABID.DAUD@GMAIL.COM
              </p>
              <p className="text-sm font-bold">TRN: 104235363900003</p>
            </div>
          </div>

          <div className="text-center py-2 bg-gray-100">
            <h2 className="text-xl font-bold">INVOICE</h2>
          </div>
        </div>

        {/* Company and Invoice Details */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p><strong>COMPANY NAME:</strong> {invoiceData.company?.toUpperCase()}</p>
            <p><strong>INVOICE ID:</strong> {invoiceData.id}</p>
            <p><strong>ORDER COUNT:</strong> {invoiceData.orderCount}</p>
          </div>
          <div className="flex-1 p-3 text-right">
            <p><strong>INVOICE NO:</strong> {invoiceData.id}</p>
            <p><strong>DATE:</strong> {(() => {
              const date = new Date();
              const day = date.getDate().toString().padStart(2, "0");
              const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
              const month = months[date.getMonth()];
              const year = date.getFullYear();
              return `${day} ${month} ${year}`;
            })()}</p>
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
              <th className="border border-black px-1 py-1 w-16">EXTRA TYPE</th>
              <th className="border border-black px-1 py-1 w-16">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoiceTableData.map((item, index) => (
              <tr key={index} className="h-6">
                <td className="border border-black px-1 py-1 text-center">{item.sno || ""}</td>
                <td className="border border-black px-1 py-1 text-center">{item.date}</td>
                <td className="border border-black px-1 py-1 text-center">{item.from}</td>
                <td className="border border-black px-1 py-1 text-center">{item.to}</td>
                <td className="border border-black px-1 py-1 text-center">{item.container}</td>
                <td className="border border-black px-1 py-1 text-center">{item.rate}</td>
                <td className="border border-black px-1 py-1 text-center">{item.token}</td>
                <td className="border border-black px-1 py-1 text-center">{item.insp}</td>
                <td className="border border-black px-1 py-1 text-center">{item.bills}</td>
                <td className="border border-black px-1 py-1 text-center">{item.extra}</td>
                <td className="border border-black px-1 py-1 text-center">{item.extratype}</td>
                <td className="border border-black px-1 py-1 text-center">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in Words and Totals */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p><strong>AMOUNT: {numberToWords(total)}</strong></p>
          </div>
          <div className="w-40 p-3">
            <div className="text-right space-y-1">
              <p><strong>TOTAL:</strong> {subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex">
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
  );
};

export default InvoiceNoVatGenerate;
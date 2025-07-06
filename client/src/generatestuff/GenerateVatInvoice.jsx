import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

const GenerateVatInvoice = ({ customerid }) => {
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const transformDataToInvoiceFormat = (data) => {
    return data.map((item, index) => ({
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
      // Display the amount as total - vat
      amount: (item.total - (item.vat || 0)).toFixed(2),
      vat: (item.vat || 0).toFixed(2),
    }));
  };

  const invoiceData = transformDataToInvoiceFormat(customerData);

  // Remove the empty rows - only use actual data
  const allRows = invoiceData;

  // Calculate totals - sum of all individual VAT amounts and amounts
  const subtotal = invoiceData.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0
  );
  const vat = invoiceData.reduce(
    (sum, item) => sum + (parseFloat(item.vat) || 0),
    0
  );
  const total = subtotal + vat;

  // Convert number to words (simplified version)
  const numberToWords = (num) => {
    if (num === 0) return "ZERO";

    const ones = [
      "",
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE",
    ];
    const teens = [
      "TEN",
      "ELEVEN",
      "TWELVE",
      "THIRTEEN",
      "FOURTEEN",
      "FIFTEEN",
      "SIXTEEN",
      "SEVENTEEN",
      "EIGHTEEN",
      "NINETEEN",
    ];
    const tens = [
      "",
      "",
      "TWENTY",
      "THIRTY",
      "FORTY",
      "FIFTY",
      "SIXTY",
      "SEVENTY",
      "EIGHTY",
      "NINETY",
    ];
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
          result =
            chunkWords +
            (thousands[chunkCount] ? " " + thousands[chunkCount] : "") +
            (result ? " " + result : "");
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

  const [customername, SetCustomerName] = useState();
  const [customerAddress, setCustomerAddress] = useState();
  const [customerPhone, setCustomerPhone] = useState();
  const [customerTaxNumber, setCustomerTaxNumber] = useState();
  const [invoiceNumber, setInvoiceNumber] = useState();

  const getCustomerData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/user/customerdata/${customerid}`);

      if (response.data.success && response.data.customerData) {
        setCustomerData(response.data.customerData);
        SetCustomerName(response.data.customerInfo.customername);
        setCustomerAddress(response.data.customerInfo.address);
        setCustomerPhone(response.data.customerInfo.phoneno);
        setCustomerTaxNumber(response.data.customerInfo.taxnumber);
        // Generate random invoice number (5-6 digits)
        const randomInvoiceNumber = Math.floor(Math.random() * 900000) + 100000;
        setInvoiceNumber(randomInvoiceNumber);
      } else {
        toast.error("No customer data found", {
          duration: 3000,
        });
      }
    } catch (error) {
      console.log("error in getting customer data", error);
      toast.error("Error in getting data", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomerData();
  }, [customerid]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <div className="text-lg">LOADING INVOICE DATA...</div>
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
          🖨️ PRINT INVOICE
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
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/2769/2769339.png";
                }}
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">BURJ AL SAMA TRANSPORT LLC</h1>
              <p className="text-sm">
                CONTACT NO: 055-2347526, P.O.BOX 76498, DUBAI, UAE, E-MAIL:
                ABID.DAUD@GMAIL.COM
              </p>
              <p className="text-sm font-bold">TRN: 104235363900003</p>
            </div>
          </div>

          {/* Invoice Header */}
          <div className="text-center py-2 bg-gray-100">
            <h2 className="text-xl font-bold">INVOICE</h2>
          </div>
        </div>

        {/* Company and Invoice Details */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p>
              <strong>COMPANY NAME:</strong> {customername?.toUpperCase()}
            </p>
            <p>
              <strong>ADDRESS:</strong> {customerAddress?.toUpperCase()}
            </p>
            <p>
              <strong>PHONE NO:</strong> {customerPhone}
            </p>
            <p>
              <strong>TAX NUMBER:</strong> {customerTaxNumber}
            </p>
          </div>
          <div className="flex-1 p-3 text-right">
            <p>
              <strong>INVOICE NO:</strong> {invoiceNumber}
            </p>
            <p>
              <strong>DATE:</strong>{" "}
              {(() => {
                const date = new Date();
                const day = date.getDate().toString().padStart(2, "0");
                const months = [
                  "JAN",
                  "FEB",
                  "MAR",
                  "APR",
                  "MAY",
                  "JUN",
                  "JUL",
                  "AUG",
                  "SEP",
                  "OCT",
                  "NOV",
                  "DEC",
                ];
                const month = months[date.getMonth()];
                const year = date.getFullYear();
                return `${day} ${month} ${year}`;
              })()}
            </p>
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
              <th className="border border-black px-1 py-1 w-12">VAT</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map((item, index) => (
              <tr key={index} className="h-6">
                <td className="border border-black px-1 py-1 text-center">
                  {item.sno || ""}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.date}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.from}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.to}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.container}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.rate}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.token}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.insp}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.bills}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.extra}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.extratype}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.amount}
                </td>
                <td className="border border-black px-1 py-1 text-center">
                  {item.vat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Amount in Words and Totals */}
        <div className="flex border-b border-black">
          <div className="flex-1 p-3 border-r border-black">
            <p>
              <strong>AMOUNT: {numberToWords(total)}</strong>
            </p>
          </div>
          <div className="w-40 p-3">
            <div className="text-right space-y-1">
              <p>
                <strong>SUB TOTAL:</strong> {subtotal.toFixed(2)}
              </p>
              <p>
                <strong>VAT 5%:</strong> {vat.toFixed(2)}
              </p>
              <p>
                <strong>TOTAL:</strong> {total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex">
          {/* Bank Details */}
          <div className="flex-1 p-3 border-r border-black">
            <h3 className="font-bold mb-2">BANK DETAIL:</h3>
            <div className="text-xs space-y-1">
              <p>
                <strong>A/C NO:</strong> 13412215820001
              </p>
              <p>
                <strong>IBAN:</strong> AE280030013412215820001
              </p>
              <p>
                <strong>NAME:</strong> BURJ AL SAMA TRANSPORT LLC
              </p>
              <p>
                <strong>SWIFT CODE:</strong> ADCBAEAAXXX
              </p>
              <p>
                <strong>BANK:</strong> ABU DHABI COMMERCIAL BANK
              </p>
              <p>
                <strong>CONTACT NO:</strong> 055-2347526
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="w-40 p-3">
            <h3 className="font-bold mb-2">CONTACT DETAIL:</h3>
            <div className="text-xs space-y-1">
              <p>
                <strong>NAME:</strong> MALIK USAMA
              </p>
              <p>
                <strong>CONTACT NO:</strong> 056-8002250
              </p>
              <div className="mt-3">
                <p>
                  <strong>NAME:</strong> ABID DAUD
                </p>
                <p>
                  <strong>JOB NO:</strong> -------------------
                </p>
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

export default GenerateVatInvoice;

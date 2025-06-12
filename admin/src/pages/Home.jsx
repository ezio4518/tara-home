import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { backendUrl } from "../App";
import ClipLoader from "react-spinners/ClipLoader";

const Home = ({ token }) => {
  const [loading, setLoading] = useState(false);

  const exportOrdersToExcel = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      const orders = response.data.orders;
      if (!orders || !Array.isArray(orders)) {
        throw new Error("Invalid orders data");
      }

      const worksheetData = orders
        .filter((order) => order.status !== "Delivered")
        .map((order) => ({
          Name: order.address.firstName + " " + order.address.lastName,
          Products: order.items
            .map((item) => `${item.name}(${item.quantity})`)
            .join(", "),
          Amount: order.amount,
          Phone: order.address.phone,
          Email: order.address.email,
          Address: Array.from(
            new Set(
              [
                order.address.street,
                order.address.city,
                order.address.state,
                order.address.zipCode,
                order.address.country,
              ].filter(Boolean)
            )
          ).join(", "),
          Status: order.status,
          PaymentMethod: order.paymentMethod,
          PaymentDone: order.payment,
          Date: new Date(order.date).toLocaleString(),
        }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const worksheetCols = Object.keys(worksheetData[0] || {}).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...worksheetData.map((row) =>
              row[key] ? row[key].toString().length : 0
            )
          ) + 2,
      }));
      worksheet["!cols"] = worksheetCols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      XLSX.writeFile(workbook, "orders.xlsx");
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      alert("Failed to export orders. Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center text-[#40350A]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-center text-[#A1876F] mb-8 max-w-xl">
        Manage your products, view inventory, and control key aspects of your
        online store from here.
      </p>

      <div className="flex flex-wrap justify-center gap-6 max-w-[768px] mb-8">
        <Link
          to="/add"
          className="w-48 text-center py-4 rounded-xl shadow-md font-medium"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          ➕ Add Product
        </Link>
        <Link
          to="/list"
          className="w-48 text-center py-4 rounded-xl shadow-md font-medium"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          📦 View Products
        </Link>
        <Link
          to="/orders"
          className="w-48 text-center py-4 rounded-xl shadow-md font-medium"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          📑 View Orders
        </Link>
        <Link
          to="/analytics"
          className="w-48 text-center py-4 rounded-xl shadow-md font-medium"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          📊 Analytics
        </Link>
      </div>

      <hr className="w-full max-w-2xl border border-[#A1876F] mb-8" />

      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <Link
          to="/bulk-upload"
          className="min-w-[200px] px-6 py-3 rounded-full shadow-md font-medium flex justify-center items-center gap-2"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          📤 Bulk Upload Products
        </Link>

        <button
          className="min-w-[200px] px-6 py-3 rounded-full shadow-md font-medium flex justify-center items-center gap-2"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
          onClick={exportOrdersToExcel}
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader size={20} color="#F0E1C6" />
              Exporting...
            </>
          ) : (
            <>🕒 Get Recent Orders</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;

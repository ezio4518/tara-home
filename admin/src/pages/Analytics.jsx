import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAnalytics } from "react-icons/md";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { backendUrl } from "../App";
import ClipLoader from "react-spinners/ClipLoader";

const COLORS = ["#40350A", "#A1876F", "#F0E1C6", "#CBB89D", "#7B674F"];

const Analytics = ({ token }) => {
  const [data, setData] = useState({});
  const [salesRange, setSalesRange] = useState("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const endpoints = [
          "total-orders",
          "total-revenue",
          "total-users",
          "total-products",
          "daily-sales",
          "weekly-sales",
          "monthly-sales",
          "yearly-sales",
          "top-categories",
          "top-products-revenue",
          "user-registrations",
          "recent-orders",
          "order-status-distribution",
          "payment-methods",
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(`${backendUrl}/api/analytics/${endpoint}`, {
              headers: { token },
            })
          )
        );

        const result = Object.fromEntries(
          endpoints.map((key, idx) => [key, responses[idx].data])
        );

        setData(result);
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
      setLoading(false);
    };

    fetchAll();
  }, [token]);

  const formatXAxisLabel = (value) => {
    if (salesRange === "daily") {
      const date = new Date(value);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    }
    if (salesRange === "monthly") {
      const [year, month] = value.split("-");
      const date = new Date(`${year}-${month}-01`);
      return date.toLocaleDateString("en-GB", { month: "short" });
    }
    return value;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#40350A]">
        <ClipLoader size={40} color="#40350A" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 text-[#40350A]">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <MdAnalytics className="text-4xl text-[#40350A]" />
        Analytics Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard label="Total Orders" value={data["total-orders"]?.totalOrders} />
        <StatCard label="Total Revenue" value={`₹${data["total-revenue"]?.totalRevenue || 0}`} />
        <StatCard label="Total Users" value={data["total-users"]?.totalUsers} />
        <StatCard label="Total Products" value={data["total-products"]?.totalProducts} />
      </div>

      <div className="mt-12 space-y-12">
        <ChartCard title="📊 Sales Overview">
          <div className="flex gap-4 mb-4">
            {["daily", "weekly", "monthly", "yearly"].map((range) => (
              <button
                key={range}
                onClick={() => setSalesRange(range)}
                className={`px-4 py-2 rounded-md font-medium ${
                  salesRange === range
                    ? "bg-[#40350A] text-white"
                    : "bg-[#CBB89D] text-[#40350A]"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data[`${salesRange}-sales`] || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={
                  salesRange === "yearly"
                    ? "year"
                    : salesRange === "monthly"
                    ? "month"
                    : salesRange === "weekly"
                    ? "week"
                    : "day"
                }
                tickFormatter={formatXAxisLabel}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#40350A"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🔥 Top Categories">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data["top-categories"] || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#40350A" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="🏆 Top Products by Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data["top-products-revenue"] || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#A1876F" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="👤 User Registrations Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data["user-registrations"] || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#7B674F"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="📦 Order Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data["order-status-distribution"] || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#40350A"
                label
              >
                {(data["order-status-distribution"] || []).map((_, index) => (
                  <Cell
                    key={`cell-status-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {data["order-status-distribution"] && (
            <CustomLegend data={data["order-status-distribution"]} />
          )}
        </ChartCard>

        <ChartCard title="💳 Payment Method Usage">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data["payment-methods"] || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#A1876F"
                label
              >
                {(data["payment-methods"] || []).map((_, index) => (
                  <Cell
                    key={`cell-payment-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {data["payment-methods"] && (
            <CustomLegend data={data["payment-methods"]} />
          )}
        </ChartCard>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div
    className="rounded-xl shadow-md p-6 text-center"
    style={{ backgroundColor: "#F0E1C6", color: "#40350A" }}
  >
    <h4 className="text-lg font-medium mb-2">{label}</h4>
    <p className="text-2xl font-bold">{value ?? "..."}</p>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div
    className="rounded-xl shadow-md p-6"
    style={{ backgroundColor: "#F0E1C6", color: "#40350A" }}
  >
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const CustomLegend = ({ data }) => (
  <div className="flex flex-wrap gap-4 mt-4">
    {data.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span>{entry.name}</span>
      </div>
    ))}
  </div>
);

export default Analytics;
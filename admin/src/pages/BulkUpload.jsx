import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

const BulkUpload = ({ token }) => {
  const [csv, setCsv] = useState(null);
  const [zip, setZip] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csv || !zip) return toast.error("CSV and ZIP both required.");
    const formData = new FormData();
    formData.append("csv", csv);
    formData.append("zip", zip);
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/product/bulk-upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token,
        },
      });
      res.data.success
        ? toast.success("Uploaded successfully!")
        : toast.error(res.data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 border rounded-lg shadow-md" style={{ borderColor: "#A1876F" }}>
      <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "#40350A" }}>
        📤 Bulk Product Upload
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div>
          <label className="block mb-1 font-medium" style={{ color: "#A1876F" }}>CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsv(e.target.files[0])}
            required
            className="w-full px-3 py-2 border rounded"
            style={{ borderColor: "#A1876F", color: "#A1876F" }}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" style={{ color: "#A1876F" }}>ZIP File:</label>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setZip(e.target.files[0])}
            required
            className="w-full px-3 py-2 border rounded"
            style={{ borderColor: "#A1876F", color: "#A1876F" }}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 flex justify-center items-center gap-2 rounded"
          style={{ backgroundColor: "#40350A", color: "#F0E1C6" }}
        >
          {loading ? <ClipLoader size={20} color="#F0E1C6" /> : "🚀 Start Bulk Upload"}
        </button>
      </form>
    </div>
  );
};

export default BulkUpload;
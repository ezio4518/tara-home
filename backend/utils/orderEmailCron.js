import cron from "node-cron";
import orderModel from "../models/orderModel.js";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();  // Load .env file variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cron.schedule("27 2 * * *", async () => {
  console.log("Cron job started at", new Date().toLocaleString());
  try {
    const orders = await orderModel.find({});

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
          ...worksheetData.map((row) => row[key]?.toString().length || 0)
        ) + 2,
    }));
    worksheet["!cols"] = worksheetCols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const filePath = path.join(__dirname, "orders.xlsx");
    XLSX.writeFile(workbook, filePath);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Panel" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "Daily Pending Orders",
      text: "Attached is the Excel report of pending orders.",
      attachments: [
        {
          filename: "orders.xlsx",
          path: filePath,
        },
      ],
    });

    console.log("✅ Email with Excel sent");

    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("❌ Failed to send Excel email:", err.message);
  }
});

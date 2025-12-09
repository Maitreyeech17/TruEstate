import React from "react";
import "./TransactionTable.css";

function TransactionTable({ transactions }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "-";
    return `₹${Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="transaction-table-wrapper">
      <div className="table-scroll">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Product Category</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Customer Region</th>
              <th>Product ID</th>
              <th>Employee Name</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, index) => (
              <tr key={t._id || index}>
                <td>{t["Transaction ID"] || "-"}</td>
                <td>{formatDate(t["Date"])}</td>
                <td>{t["Customer ID"] || "-"}</td>
                <td className="bold">{t["Customer Name"] || "-"}</td>
                <td>{t["Phone Number"] || "-"}</td>
                <td>{t["Gender"] || "-"}</td>
                <td>{t["Age"] || "-"}</td>
                <td>
                  <span className="chip">{t["Product Category"] || "-"}</span>
                </td>
                <td className="bold">{t["Quantity"] || "-"}</td>
                <td className="bold">{formatCurrency(t["Final Amount"])}</td>
                <td>{t["Customer Region"] || "-"}</td>
                <td>{t["Product ID"] || "-"}</td>
                <td>{t["Employee Name"] || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;

import React from "react";
import { Info } from 'lucide-react';
import { useState } from 'react';
import './StatsBoxes.css';

function StatsBoxes({ transactions }) {
  const [showTooltip, setShowTooltip] = useState(null);

  const totalUnits = transactions.reduce((sum, t) => sum + (t.Quantity || 0), 0);
  const totalAmount = transactions.reduce((sum, t) => sum + (t['Final Amount'] || 0), 0);
  const totalDiscount = transactions.reduce((sum, t) => {
    const total = t['Total Amount'] || 0;
    const final = t['Final Amount'] || 0;
    return sum + (total - final);
  }, 0);

  const stats = [
    { id: 'units', title: 'Total Units Sold', value: totalUnits.toLocaleString(), tooltip: 'Total quantity of products sold across all transactions' },
    { id: 'amount', title: 'Total Amount', value: `₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, tooltip: 'Total final amount after discounts' },
    { id: 'discount', title: 'Total Discount', value: `₹${totalDiscount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, tooltip: 'Total discount amount given across all transactions' }
  ];

  return (
    <div className="stats-boxes-container">
      {stats.map((stat) => (
        <div key={stat.id} className="stats-box">
          <div className="stats-box-header">
            <h3 className="stats-box-title">{stat.title}</h3>
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(stat.id)}
                onMouseLeave={() => setShowTooltip(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Info className="w-4 h-4" />
              </button>
              {showTooltip === stat.id && (
                <div className="stats-box-tooltip">
                  {stat.tooltip}
                  <div className="stats-box-tooltip-arrow"></div>
                </div>
              )}
              
            </div>
            
          </div>
          <p className="stats-box-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsBoxes;

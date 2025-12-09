//LoadingSpinner.jsx
import React from "react";

import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-600">Loading transactions...</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
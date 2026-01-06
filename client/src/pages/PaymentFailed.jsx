import React from "react";
import { useNavigate } from "react-router-dom";
function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold text-red-600">Payment Failed</h1>
      <button
        onClick={() => navigate("/checkout")}
        className="mt-6 px-6 py-3 bg-black text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}

export default PaymentFailed;

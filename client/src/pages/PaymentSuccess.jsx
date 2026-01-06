import { useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import { verifyPhonePePaymentApi } from "../api/api";

function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const transactionId = params.get("txn");

  useEffect(() => {
    const verifyPayment = async () => {
      toast.loading("Verifying payment...", { id: "verify" });

      const res = await verifyPhonePePaymentApi(transactionId);

      toast.dismiss("verify");

      if (!res.success) {
        toast.error("Payment verification failed");
        return navigate("/payment-failed");
      }

      toast.success("Order placed successfully!");
      navigate("/profile"); // or order success page
    };

    if (transactionId) {
      verifyPayment();
    }
  }, [transactionId, navigate]);

  return (
    <div className="h-[70vh] flex items-center justify-center text-xl">
      Verifying payment, please wait...
    </div>
  );
}

export default PaymentSuccess;

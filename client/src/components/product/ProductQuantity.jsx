import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import React from "react";

export default function ProductQuantity({ quantity, setQuantity }) {
  const increase = () => {
    setQuantity((prev) => (prev < 50 ? prev + 1 : prev));
  };

  const decrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center py-2 border rounded-xl w-fit shadow"
    >
      <Button
        onClick={decrease}
        className="rounded-md py-1.5 text-sm"
        disabled={quantity === 1}
      >
        -
      </Button>

      <span className="text-lg font-medium text-center">{quantity}</span>

      <Button
        onClick={increase}
        className="rounded-md  py-1.5 text-sm"
        disabled={quantity === 50}
      >
        +
      </Button>
    </motion.div>
  );
}

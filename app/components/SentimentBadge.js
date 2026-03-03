"use client";
import { motion } from "framer-motion";

export default function SentimentBadge({ sentiment }) {
  const color =
    sentiment === "Positive"
      ? "bg-green-600"
      : sentiment === "Negative"
        ? "bg-red-600"
        : "bg-yellow-500";

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 3 }}
     className={`${color} px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg inline-block`}
    >
      {sentiment}
    </motion.span>
  );
}

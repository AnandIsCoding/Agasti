import React from "react";
import { FaGift, FaHeadset, FaTruck, FaUndo, FaWallet } from "react-icons/fa";
export default function FeatureStrip() {
  const items = [
    {
      icon: <FaTruck size={38} />,
      title: "Free Shipping",
      subtitle: "For all Orders Over 3000",
    },
    {
      icon: <FaUndo size={38} />,
      title: "30 Days Returns",
      subtitle: "For an Exchange Product",
    },
    {
      icon: <FaWallet size={38} />,
      title: "Secured Payment",
      subtitle: "Payment Cards Accepted",
    },
    {
      icon: <FaGift size={38} className="" />,
      title: "Special Gifts",
      subtitle: "Our First Product Order",
    },
    {
      icon: <FaHeadset size={38} />,
      title: "Support 24/7",
      subtitle: "Contact us Anytime",
    },
  ];

  return (
    <div className="w-full bg-white py-10 mt-8  ">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
        {items.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col items-center transition-all duration-300 cursor-pointer"
          >
            <div className="transition-all duration-300 group-hover:-translate-y-2 group-hover:text-[#f85a5a]">
              {item.icon}
            </div>

            <h3 className="mt-4 font-semibold text-[16px] text-gray-800">
              {item.title}
            </h3>

            <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

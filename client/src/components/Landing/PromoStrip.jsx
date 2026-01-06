import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

export default function PromoStrip() {
  const stripRef = useRef(null);

  const items = [
    "♻️ Ayurvedic Products",
    "📚 Oral care",
    "💡 General Wellness",
  ];

  useEffect(() => {
    const strip = stripRef.current;

    // Horizontal infinite scroll
    gsap.to(strip, {
      xPercent: -50, // scroll half of duplicated strip
      repeat: -1,
      duration: 18,
      ease: "linear",
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        padding: "4px 0",
        background: "#F6EEDB",
      }}
    >
      <div
        ref={stripRef}
        style={{
          display: "flex",
          gap: "16px",
          whiteSpace: "nowrap",
          padding: "0 16px",
        }}
      >
        {/* Duplicate items for seamless scroll */}
        {[...items, ...items].map((item, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 33%", // 3 items visible at a time
              color: "black",
              fontWeight: "bold",
              fontSize: "1rem",
              textAlign: "center",
              padding: "0px 16px",
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

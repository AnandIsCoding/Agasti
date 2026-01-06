import React from "react";

function ProductListingPageSlider({ selected }) {
  return (
    <aside className="sidebar">
      <div className="box">
        <h3>All Products: {selected}</h3>
      </div>
    </aside>
  );
}

export default ProductListingPageSlider;

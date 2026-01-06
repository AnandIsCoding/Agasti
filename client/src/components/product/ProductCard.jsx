/* LUCIDE ICONS */
import { Leaf, Ruler, Star, StarOff, Weight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ p }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${p?._id}`)}
      className="relative group border-y border-l border-r border-gray-300 p-4 cursor-pointer bg-white
                 hover:shadow-sm shadow-pink-200 transition
                 min-h-[410px] sm:min-h-[410px] flex flex-col"
    >
      {/* STOCK BADGE */}
      {!p?.inStock ? (
        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </span>
      ) : (
        <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
          In Stock
        </span>
      )}

      {/* SUSTAINABILITY BADGE */}
      {p?.sustainability && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
          <Leaf size={13} />
          Eco
        </span>
      )}

      {/* IMAGES */}
      <div className="rounded-md">
        {p?.images?.[0] && (
          <img
            className="group-hover:hidden rounded-xl h-40 sm:h-48 w-full object-contain mb-3"
            src={p.images[0]}
            alt={p?.name}
          />
        )}

        {p?.images?.[1] && (
          <img
            className="hidden group-hover:block rounded-xl h-40 sm:h-48 w-full object-contain mb-3"
            src={p.images[1]}
            alt={p?.name}
          />
        )}
      </div>

      {/* PRODUCT NAME */}
      <h3 className="font-semibold text-sm mt-1 line-clamp-2 text-gray-800">
        {p?.name}
      </h3>

      {/* RATING */}
      <div className="flex gap-1 my-1 text-yellow-500">
        {[1, 2, 3, 4, 5].map((r) => (
          <span key={r}>
            {r <= (p?.rating || 0) ? (
              <Star size={16} fill="currentColor" />
            ) : (
              <StarOff size={16} />
            )}
          </span>
        ))}
      </div>

      {/* LONG DESCRIPTION (CLIPPED) */}
      {p?.longDescription && (
        <p className="text-md text-black line-clamp-2 mt-1">
          {p.longDescription}
        </p>
      )}

      {/* EXTRA INFO */}
      <div className="text-sm text-gray-600 space-y-1 mt-2">
        {p?.dimension && (
          <div className="flex items-center gap-1">
            <Ruler size={15} />
            <span className="font-medium">{p.dimension}</span>
          </div>
        )}

        {p?.weight && (
          <div className="flex items-center gap-1">
            <Weight size={15} />
            <span className="font-medium">{p.weight}</span>
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="mt-auto pt-2">
        {p?.offerPrice && p?.price && (
          <span className="text-gray-400 line-through mr-2 text-sm">
            ₹ {p.price}
          </span>
        )}

        <span className="text-red-500 font-semibold text-lg">
          ₹ {p?.offerPrice || p?.price}
        </span>
      </div>
    </div>
  );
}

export default ProductCard;

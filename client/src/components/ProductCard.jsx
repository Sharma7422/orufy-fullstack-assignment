import { useState } from "react";

export default function ProductCard({ 
  product, 
  onPublishToggle, 
  onEdit, 
  onDelete,
  bgColorClass 
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.productImages || [];
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white p-4 md:p-6 ${bgColorClass || "bg-white"}`}>
      {/* Product Image with Carousel */}
      {images.length > 0 ? (
        <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden group mb-4 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" style={{ height: "215px", width: "215px", minHeight: "215px", margin: "0 auto" }}>
          <img
            src={`http://localhost:3456/uploads/${currentImage}`}
            alt={product.productName}
            className="w-full h-full object-contain"
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 md:p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 md:p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                </svg>
              </button>
            </>
          )}

          {/* Image Indicator Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? "bg-orange-500 w-2 md:w-2.5 h-2 md:h-2.5" : "bg-gray-400 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs md:text-sm mb-4" style={{ height: "215px", width: "215px", minHeight: "215px", margin: "0 auto" }}>
          No Image
        </div>
      )}

      {/* Product Details */}
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {product.productName}
      </h3>

      <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm mb-4">
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Product type -</span>
          <span className="text-gray-900 font-medium text-right line-clamp-1">{product.productType}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Qty Stock -</span>
          <span className="text-gray-900 font-medium">{product.quantityStock}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">MRP -</span>
          <span className="text-gray-900 font-medium">₹ {product.mrp}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Selling Price -</span>
          <span className="text-gray-900 font-medium">₹ {product.sellingPrice}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Brand -</span>
          <span className="text-gray-900 font-medium text-right line-clamp-1">{product.brandName}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Images -</span>
          <span className="text-gray-900 font-medium">{images.length}</span>
        </p>
        <p className="text-gray-600 flex justify-between gap-2">
          <span className="flex-shrink-0">Exchange -</span>
          <span className="text-gray-900 font-medium">{product.exchangeOrReturn ? "YES" : "NO"}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 md:gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onPublishToggle(product._id)}
          className={`flex-1 cursor-pointer px-2 md:px-3 py-2 text-white font-semibold rounded text-xs md:text-sm transition-colors ${
            product.publishedStatus 
              ? "bg-[#52D407] hover:bg-[#3a8a05]" 
              : "bg-[#000FB4] hover:bg-[#00008b]"
          }`}
        >
          {product.publishedStatus ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(product._id)}
          className="flex-1 px-2 md:px-3 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded text-xs md:text-sm border border-gray-300 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-2 md:px-3 py-2 text-gray-400 hover:bg-gray-50 rounded text-xs md:text-sm border border-gray-300 hover:border-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

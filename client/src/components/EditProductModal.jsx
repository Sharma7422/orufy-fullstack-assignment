import { useState, useEffect } from "react";
import { updateProduct, getProductById } from "../api/axios";

export default function EditProductModal({ isOpen, onClose, onProductUpdated, productId, showToast }) {
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    quantityStock: "",
    mrp: "",
    sellingPrice: "",
    brandName: "",
    exchangeOrReturn: "true",
  });

  const [productImages, setProductImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState([]);

  const productTypes = [
   "Select product type",
    "Foods",
    "Clothes",
    "Electronics",
    "Beauty Products",
    "Other",
  ];

  // Fetch product data when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductData();
    }
  }, [isOpen, productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      const product = response.data.product;
      setFormData({
        productName: product.productName,
        productType: product.productType,
        quantityStock: product.quantityStock.toString(),
        mrp: product.mrp.toString(),
        sellingPrice: product.sellingPrice.toString(),
        brandName: product.brandName,
        exchangeOrReturn: product.exchangeOrReturn ? "true" : "false",
      });
      // Store existing images
      setExistingImages(product.productImages || []);
      setProductImages([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setProductImages([...productImages, ...newImages]);
    }
  };

  const removeNewImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.productName ||
      !formData.productType ||
      formData.productType === "Select product type" ||
      !formData.quantityStock ||
      !formData.mrp ||
      !formData.sellingPrice ||
      !formData.brandName
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const submitFormData = new FormData();
      submitFormData.append("productName", formData.productName);
      submitFormData.append("productType", formData.productType);
      submitFormData.append("quantityStock", formData.quantityStock);
      submitFormData.append("mrp", formData.mrp);
      submitFormData.append("sellingPrice", formData.sellingPrice);
      submitFormData.append("brandName", formData.brandName);
      submitFormData.append("exchangeOrReturn", formData.exchangeOrReturn);

      // Add new images if selected
      if (productImages && productImages.length > 0) {
        productImages.forEach((imageObj) => {
          submitFormData.append("productImages", imageObj.file);
        });
      }
      
      // Add existing images that weren't removed
      if (existingImages && existingImages.length > 0) {
        existingImages.forEach((imageUrl) => {
          submitFormData.append("existingImages", imageUrl);
        });
      }

      const response = await updateProduct(productId, submitFormData);

      showToast("Product updated successfully!", "success");
      onProductUpdated(response.data.product);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update product", "error");
      console.error("Error updating product:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-50 via-white to-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Type *
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Stock *
            </label>
            <input
              type="number"
              name="quantityStock"
              value={formData.quantityStock}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              MRP (Maximum Retail Price) *
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleInputChange}
              placeholder="Enter MRP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price *
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              placeholder="Enter selling price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Name *
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              placeholder="Enter brand name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          {/* Exchange or Return */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exchange/Return Eligible
            </label>
            <select
              name="exchangeOrReturn"
              value={formData.exchangeOrReturn}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Product Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-900">
                Product Images
              </label>
              {(existingImages.length > 0 || productImages.length > 0) && (
                <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                  Add More Photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Existing Images</p>
                <div className="grid grid-cols-3 gap-3">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index}`}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imageUrl)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {productImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">New Images</p>
                <div className="grid grid-cols-3 gap-3">
                  {productImages.map((imageObj, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageObj.preview}
                        alt={`New ${index}`}
                        className="w-10 h-10   object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Input for initial upload */}
            {existingImages.length === 0 && productImages.length === 0 && (
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm"
              />
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              You can upload multiple images and manage them as needed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

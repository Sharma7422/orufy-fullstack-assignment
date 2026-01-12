import { useState } from "react";
import API from "../api/axios";

export default function AddProductModal({ isOpen, onClose, onProductAdded, showToast }) {
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
  const [fieldErrors, setFieldErrors] = useState({});

  const productTypes = [
    "Select product type",
    "Foods",
    "Clothes",
    "Electronics",
    "Beauty Products",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
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

  const removeImage = (index) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const newErrors = {};

    // Field-level validation
    if (!formData.productName) {
      newErrors.productName = "Please enter product name";
    }
    if (!formData.productType || formData.productType === "Select product type") {
      newErrors.productType = "Please select a product type";
    }
    if (!formData.quantityStock) {
      newErrors.quantityStock = "Please enter quantity stock";
    }
    if (!formData.mrp) {
      newErrors.mrp = "Please enter MRP";
    }
    if (!formData.sellingPrice) {
      newErrors.sellingPrice = "Please enter selling price";
    }
    if (!formData.brandName) {
      newErrors.brandName = "Please enter brand name";
    }
    if (!productImages || productImages.length === 0) {
      newErrors.images = "Please upload at least one product image";
    }

    
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("productName", formData.productName);
      submitData.append("productType", formData.productType);
      submitData.append("quantityStock", parseInt(formData.quantityStock));
      submitData.append("mrp", parseFloat(formData.mrp));
      submitData.append("sellingPrice", parseFloat(formData.sellingPrice));
      submitData.append("brandName", formData.brandName);
      submitData.append("exchangeOrReturn", formData.exchangeOrReturn === "true");
      
      // Add all images
      productImages.forEach((imageObj) => {
        submitData.append("productImages", imageObj.file);
      });

      const response = await API.post("/products/create", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showToast("Product added successfully!", "success");
        onProductAdded(response.data.product);
        setFormData({
          productName: "",
          productType: "",
          quantityStock: "",
          mrp: "",
          sellingPrice: "",
          brandName: "",
          exchangeOrReturn: "true",
        });
        setProductImages([]);
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create product", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">Add Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="CakeZone Walnut Brownie"
              autoComplete="off"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.productName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {fieldErrors.productName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.productName}</p>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleInputChange}
              className={`w-full px-3 bg-py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 bg-white ${
                fieldErrors.productType
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {fieldErrors.productType && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.productType}</p>
            )}
          </div>

          {/* Quantity Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Quantity Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantityStock"
              value={formData.quantityStock}
              onChange={handleInputChange}
              placeholder="200"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.quantityStock
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {fieldErrors.quantityStock && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.quantityStock}</p>
            )}
          </div>

          {/* MRP */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              MRP <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleInputChange}
              placeholder="1499"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.mrp
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {fieldErrors.mrp && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.mrp}</p>
            )}
          </div>

          {/* Selling Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Selling Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleInputChange}
              placeholder="999"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.sellingPrice
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {fieldErrors.sellingPrice && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.sellingPrice}</p>
            )}
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              placeholder="UrbanStyle"
              autoComplete="off"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                fieldErrors.brandName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-gray-500"
              }`}
            />
            {fieldErrors.brandName && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.brandName}</p>
            )}
          </div>

          {/* Upload Product Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-900">
                Upload Product Images <span className="text-red-500">*</span>
              </label>
              {productImages.length > 0 && (
                <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
                  Add More Photos
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Image Preview Grid */}
            {productImages.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3">
                {productImages.map((imageObj, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageObj.preview}
                      alt={`Preview ${index}`}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
            )}

            {/* File Input for initial upload */}
            {productImages.length === 0 && (
              <>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full text-sm"
                />
                {fieldErrors.images && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.images}</p>
                )}
              </>
            )}
          </div>

          {/* Exchange or Return Eligibility */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Exchange or Return Eligibility
            </label>
            <select
              name="exchangeOrReturn"
              value={formData.exchangeOrReturn}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1E40AF] text-white font-semibold rounded-lg hover:bg-[#1E3A8A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}

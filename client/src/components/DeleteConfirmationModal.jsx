import { useState } from "react";
import { deleteProduct } from "../api/axios";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onProductDeleted,
  product,
  showToast,
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct(product._id);
      showToast("Product Deleted Successfully", "success");
      
      // Close modal and refresh list immediately
      onProductDeleted(product._id);
      onClose();
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast(err.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
        {}
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Delete Product</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {}
        <div className="p-4 md:p-6">
          <p className="text-gray-700 mb-2 text-sm md:text-base">
            Are you sure you really want to delete this Product
          </p>
          <p className="text-gray-900 font-semibold mb-4 md:mb-6 text-sm md:text-base">
            "{product.productName}" ?
          </p>

          {}
          <div className="flex gap-2 md:gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-3 md:px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border border-gray-300 text-sm md:text-base transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 md:px-4 py-2 bg-[#52D407] hover:bg-[#3a8a05] disabled:bg-[#a3d48f] text-white font-semibold rounded-lg text-sm md:text-base transition-colors"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

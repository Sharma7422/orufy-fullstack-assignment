import { useState, useEffect } from "react";
import API, { updateProductStatus } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import EditProductModal from "../components/EditProductModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Toast from "../components/Toast";
import runner from "../assets/runner.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToastVisible, setShowToastVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userInitial = (user?.email || user?.phone || "U")[0].toUpperCase();

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToastVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authValue");
    navigate("/login");
  };

  // Fetch products based on status
  const fetchProducts = async (status) => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(`/products/list?status=${status}`);
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when tab changes
  useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab]);

  const handlePublishToggle = (productId) => {
    updateProductStatus(productId)
      .then((response) => {
        // Refresh products list after successful status update
        fetchProducts(activeTab);
        console.log("Product status updated:", response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to update product status");
        console.error("Error updating product status:", err);
      });
  };

  const handleEdit = (productId) => {
    setEditingProductId(productId);
    setShowEditModal(true);
  };

  const handleProductUpdated = (updatedProduct) => {
    // Refresh products list after edit
    fetchProducts(activeTab);
  };

  const handleDelete = (productId, product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleProductDeleted = (productId) => {
    // Refresh products list after deletion
    fetchProducts(activeTab);
  };;

  return (
    <div className="w-full h-full">
      {}
      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProductUpdated={handleProductUpdated}
        productId={editingProductId}
        showToast={showToastMessage}
      />

      {}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onProductDeleted={handleProductDeleted}
        product={deletingProduct}
        showToast={showToastMessage}
      />

      {}
      <div className="bg-gradient-to-r from-red-50 via-white to-blue-50 px-4 md:px-6 lg:px-8 py-3 border-b border-gray-200 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-gray-700 font-medium hidden sm:inline">Home</span>
        </div>

        {}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-200 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            <img 
              src={runner} 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold hidden"
              style={{ display: 'none' }}
            >
              {userInitial}
            </div>
            <svg className="hidden sm:block w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.email || user?.phone}</p>
                <p className="text-xs text-gray-500">Account</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      <div className="p-4 md:p-6 lg:p-8">
        {}

        {}
        <div className="flex gap-4 md:gap-8 border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("published")}
            className={`pb-4 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === "published"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab("unpublished")}
            className={`pb-4 font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
              activeTab === "unpublished"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Unpublished
          </button>
        </div>

        {}
        {loading && (
          <div className="flex items-center justify-center py-12 md:py-20">
            <p className="text-gray-600 text-sm md:text-base">Loading products...</p>
          </div>
        )}

        {}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 md:mb-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {}
        {!loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20">
            <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">⊞⊞</div>
            <p className="text-5xl md:text-6xl font-bold text-blue-600 mb-6 md:mb-8">⊞+</p>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              No {activeTab === "published" ? "Published" : "Unpublished"} Products
            </h2>
            <p className="text-gray-500 text-center max-w-sm text-sm md:text-base">
              Your {activeTab === "published" ? "Published" : "Unpublished"} Products will appear here
              <br />
              Create your first product to {activeTab === "published" ? "publish" : "upload"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPublishToggle={handlePublishToggle}
                onEdit={handleEdit}
                onDelete={(productId) => handleDelete(productId, product)}
                bgColorClass={activeTab === "published" ? "bg-blue-50" : "bg-green-50"}
              />
            ))}
          </div>
        )}

      {}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToastVisible}
        onClose={() => setShowToastVisible(false)}
      />
      </div>
    </div>
  );
}

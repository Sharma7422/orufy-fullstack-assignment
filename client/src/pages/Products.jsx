import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProducts, updateProductStatus } from "../api/axios";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  // Fetch all products
  const fetchAllProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getProducts();
      setProducts(response.data.products || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handlePublishToggle = (productId) => {
    updateProductStatus(productId)
      .then((response) => {
        // Refresh products list after successful status update
        fetchAllProducts();
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
    fetchAllProducts();
  };

  const handleDelete = (productId, product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  const handleProductDeleted = (productId) => {
    // Refresh products list after deletion
    fetchAllProducts();
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.productType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

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
      <div className="bg-gradient-to-r from-red-50 via-white to-blue-50 px-4 md:px-6 lg:px-8 py-3 border-b border-gray-200 flex items-center justify-between gap-2 md:gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z" />
          </svg>
          <span className="text-gray-700 font-medium text-sm md:text-base hidden sm:inline">Products</span>
        </div>

        {}
        <div className="relative w-full sm:flex-grow sm:max-w-xs">
          <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 md:px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs md:text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center cursor-pointer gap-2 p-2 hover:bg-gray-200 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-semibold">
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
                <p className="text-xs md:text-sm font-medium text-gray-900 truncate">{user?.email || user?.phone}</p>
                <p className="text-xs text-gray-500">Account</p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className="w-full cursor-pointer text-left px-4 py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 transition-colors"
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
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 cursor-pointer rounded-lg text-xs md:text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors border border-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Products</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 md:mb-8">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {}
        {loading && (
          <div className="flex items-center justify-center py-12 md:py-20">
            <p className="text-gray-600 text-sm md:text-base">Loading products...</p>
          </div>
        )}

        {}
        <AddProductModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onProductAdded={handleAddProduct}
          showToast={showToastMessage}
        />

        {}
        {!loading && filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-20">
            <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-4">⊞⊞</div>
            <p className="text-5xl md:text-6xl font-bold text-blue-600 mb-6 md:mb-8">⊞+</p>
            
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              Feels a little empty over here...
            </h2>
            <p className="text-gray-500 text-center max-w-sm mb-6 md:mb-8 text-sm md:text-base">
              You can create product without connection to a store.<br />You can add product to a store anytime.
            </p>

            <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#000FB4] text-white text-xs md:text-sm font-medium hover:bg-[#0009a3] cursor-pointer transition-colors border border-gray-300"
          >
            <span className="hidden sm:inline">Add Your Products</span>
            <span className="sm:hidden">Add</span>
          </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onPublishToggle={handlePublishToggle}
                onEdit={handleEdit}
                onDelete={(productId) => handleDelete(productId, product)}
                bgColorClass={product.publishedStatus ? "bg-blue-50" : "bg-green-50"}
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

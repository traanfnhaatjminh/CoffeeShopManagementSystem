import React, { useState } from 'react';
import EditProductModal from './EditProductModal';
import AddProductModal from './AddProductModal';
import WarehouseProduct from './warehouseProduct';

function LayoutProduct() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        {/* Product */}
        <WarehouseProduct
          setShowModal={setShowProductModal}
          setShowEditModal={setShowEditProductModal}
          setProduct={setSelectedProduct}
        />
      </div>

      {/* Add Product Modal */}
      {showProductModal && <AddProductModal closeModal={() => setShowProductModal(false)} />}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <EditProductModal product={selectedProduct} closeModal={() => setShowEditProductModal(false)} />
      )}
    </div>
  );
}

export default LayoutProduct;

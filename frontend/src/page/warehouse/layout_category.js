import React, { useState } from 'react';
import WarehouseCategory from './warehouseCategory';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

function LayoutCategory() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto">
        {/* Category */}
        <WarehouseCategory
          setShowModal={setShowCategoryModal}
          setShowEditModal={setShowEditCategoryModal}
          setCategory={setSelectedCategory}
        />
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && <AddCategoryModal closeModal={() => setShowCategoryModal(false)} />}

      {/* Edit Category Modal */}
      {showEditCategoryModal && (
        <EditCategoryModal category={selectedCategory} closeModal={() => setShowEditCategoryModal(false)} />
      )}
    </div>
  );
}

export default LayoutCategory;

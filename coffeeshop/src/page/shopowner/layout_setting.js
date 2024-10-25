import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import UserManagement from './UserManagement';
import Settings from './Settings';

function LayoutSetting() {
  // State để quản lý hiển thị modaljkashjkadh
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        {/* <UserManagement
          showModal={showModal}
          setShowModal={setShowModal}
          setShowEditModal={setShowEditModal}
          setCurrentUser={setCurrentUser}
        /> */}
        <Settings/>
      </div>

      {/* Modal để thêm người dùng */}
      {showModal && <AddUserModal closeModal={() => setShowModal(false)} />}
      {showEditModal && <EditUserModal user={currentUser} closeModal={() => setShowEditModal(false)} />}
    </div>
  );
}

export default LayoutSetting;

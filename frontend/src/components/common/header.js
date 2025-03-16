import React, { useEffect } from 'react';
import { MdLogout } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import logo from '../../assets/img/z5872646337869_8529aff6a7d5eb21b.png';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/auth-slice/authSlice';

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(logout()).then((data) => {
        navigate('/auth/login');
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleProfile = () => {
    console.log('user:', user);
    user.role.role_name === 'warehouse manager' ? navigate('/warehouse/profile') : navigate('/cashier/profile');
  };
  return (
    <div className="sticky top-0 z-10">
      <nav className="bg-brown-900 flex items-center justify-between p-4 shadow-md h-full">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-16 h-10 mr-2" />
          <span className="text-white font-pacifico text-2xl">Coffe House Management</span>
        </div>

        <div className="flex items-center gap-2 justify-center pr-5">
          <span className="text-white w-[130px] inline-block">{user?.userName || 'Guest'}</span>
          <button
            className={`bg-brown-700 text-white p-2 rounded-lg hover:bg-blue-400 ${user.role.role_name === 'admin' ? 'hidden' : ''}`}
            onClick={() => handleProfile()}
          >
            <CgProfile className="w-5 h-5" />
          </button>
          <button className="bg-brown-800 text-white p-2 rounded-lg hover:bg-red-500 " onClick={handleLogout}>
            <MdLogout className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}

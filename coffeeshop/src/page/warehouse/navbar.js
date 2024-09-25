import React from 'react';

function Navbar() {
    return (
        <nav className="bg-brown-900 flex items-center justify-between p-4 shadow-md">
            <div className="flex items-center">
                <img 
                    src="logo.png" 
                    alt="Logo" 
                    className="w-8 h-8 mr-2" 
                />
                <span className="text-white font-pacifico text-2xl">Coffe House Management</span>
            </div>

            <div className="flex items-center space-x-4">
                <span className="text-white">SDN302</span>
                <button className="bg-brown-700 text-white p-2 rounded-lg hover:bg-blue-400">Profile</button>
                <button className="bg-brown-800 text-white p-2 rounded-lg hover:bg-red-500">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;

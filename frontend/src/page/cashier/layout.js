import React from 'react'

const layout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1">
      <Header />
      <Outlet />;
    </div>
  </div>
  )
}

export default layout

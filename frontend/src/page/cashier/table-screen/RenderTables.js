import React from 'react';
import FloorPlanView from './FloorPlanView';
const RenderTables = ({
  viewMode,
  filteredTables,
  handleOpenModal,
  handleTableClick,
  floorPlanImage,
  handleUpdateTablePosition,
}) => {
  if (viewMode === 'grid') {
    return (
      <div className={`grid grid-cols-5 gap-4 p-4`}>
        {filteredTables.map((table) => (
          <div
            key={table._id}
            className="bg-white rounded-lg shadow p-4 h-40 w-32 flex flex-col items-center justify-between cursor-pointer"
            style={{
              backgroundColor: table.status === true ? '#dcfce7' : '#fee2e2',
            }}
            onClick={() => handleTableClick(table)}
          >
            <div className="text-center w-full">
              <h3 className="font-bold text-xl">{table.table_name}</h3>
              <p className="text-sm">Số ghế: {table.number_of_chair}</p>
              <p className={`text-xs font-semibold ${table.status === true ? 'text-green-500' : 'text-red-500'}`}>
                {table.status === true ? 'Đang trống' : 'Đang có khách'}
              </p>
              {/* {!table.status && (
                <p className="text-xs text-gray-500">Thời gian vào: {new Date(table.startTime).toLocaleTimeString()}</p>
              )} */}
            </div>

            {!table.status && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal(table._id);
                }}
                className="mt-2 w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
              >
                Gọi thêm
              </button>
            )}
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <FloorPlanView
        floorPlanImage={floorPlanImage}
        tables={filteredTables}
        onUpdateTablePosition={handleUpdateTablePosition}
      />
    );
  }
};
export default RenderTables;

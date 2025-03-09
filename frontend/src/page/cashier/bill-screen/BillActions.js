import React from 'react';
import { IoEyeSharp, IoPrint, IoMailOutline, IoTrashOutline } from 'react-icons/io5';

const BillActions = ({ bill, actions }) => {
  const { handleClickDetail, handlePrint, handleSendEmail, handleCancelBill } = actions;

  return (
    <div className="flex space-x-1">
      <button onClick={() => handleClickDetail(bill)} className="text-blue-600 hover:text-blue-800">
        <IoEyeSharp size={16} />
      </button>
      <button onClick={() => handlePrint(bill)} className="text-gray-600 hover:text-gray-800">
        <IoPrint size={16} />
      </button>
      {/* <button onClick={() => handleSendEmail(bill)} className="text-green-600 hover:text-green-800">
        <IoMailOutline size={16} />
      </button> */}
      {bill.status === 0 && (
        <button onClick={() => handleCancelBill(bill)} className="text-red-600 hover:text-red-800">
          <IoTrashOutline size={16} />
        </button>
      )}
    </div>
  );
};

export default BillActions;

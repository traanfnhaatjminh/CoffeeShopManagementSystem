import React from 'react';

const Card = ({ title, value, textColor, type }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-xl  ">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${type ? 'text-green-600' : 'text-red-600'}`}>
        {' '}
        {type ? '+' : '-'}
        {value.toLocaleString()} VND
      </p>
    </div>
  );
};

export default Card;

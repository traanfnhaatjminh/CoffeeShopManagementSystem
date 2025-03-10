// Utility functions for bill components

// Get payment method display name
export const getPaymentMethod = (method) => {
  if (!method) return 'Chưa thanh toán';
  switch (method) {
    case 'cash':
      return 'Tiền mặt';
    case 'transfer':
      return 'Chuyển khoản';
    default:
      return method;
  }
};

// Format discount display
export const formatDiscount = (discount) => {
  if (discount !== undefined && discount !== null) {
    return discount > 0 ? `${discount}%` : 'Không có';
  }
  return 'Chưa áp mã';
};

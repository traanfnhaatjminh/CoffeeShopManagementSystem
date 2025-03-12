export const COLORS = ['#6df63a', 'red'];
export const totalRevenue = { allBillMonth: [], totalMoney: 0 };
export const totalProfit = { totalMoneyProfit: 0 };
export const totalExpense = { totalExpense: 0, totalQuantity: 0 };
export const listChartData = [
  { name: 'Lợi nhuận', value: 10000, rase: true },
  { name: 'Chi phí', value: 10000, rase: false },
];

export const staticSelect = [
  { name: '📅 Thống kê theo tháng gần nhất', value: 'latest' },
  { name: '📈 Thống kê tất cả từ trước đến nay', value: 'all' },
];
export const staticSelectProfits = [
  { name: '📅 Tháng gần nhất', value: 'latest' },
  { name: '📈 Tất cả ', value: 'all' },
];

export const columnsConfig = {
  listTopProductOrder: [
    { key: '_id', label: 'Tên sản phẩm' },
    { key: 'total_quantity', label: 'Số lượng' },
    { key: 'total_revenue', label: 'Tổng tiền bán', isCurrency: true },
    { key: 'total_profit', label: 'Tổng lãi', isCurrency: true },
  ],
  listIngredient: [
    { key: '_id', label: 'Tên nguyên liệu' },
    { key: 'totalQuantity', label: 'Số lượng' },
    { key: 'totalExpense', label: 'Tổng tiền nhập', isCurrency: true },
  ],
};
